import { existsSync, mkdirSync, readFileSync } from "fs"
import path from "path"
import { encode } from "@auth/core/jwt"
import { neon } from "@neondatabase/serverless"

const rootEnvFiles = [".env.local", ".env"]

for (const file of rootEnvFiles) {
  if (!existsSync(file)) continue

  const content = readFileSync(file, "utf8")
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const separator = trimmed.indexOf("=")
    if (separator === -1) continue

    const key = trimmed.slice(0, separator).trim()
    const rawValue = trimmed.slice(separator + 1).trim()
    process.env[key] ??= rawValue.replace(/^["']|["']$/g, "")
  }
}

const baseUrl = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3000"
const outDir = path.join(process.cwd(), "public", "images", "landing")
const chromePath =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const remotePort = Number(process.env.CHROME_REMOTE_PORT ?? 9223)
const databaseUrl = process.env.DATABASE_URL
const authSecret = process.env.AUTH_SECRET
const reviewerEmail = (process.env.REVIEWER_LOGIN_EMAIL ?? "tester@test.com").trim().toLowerCase()

if (!databaseUrl) throw new Error("DATABASE_URL is required")
if (!authSecret) throw new Error("AUTH_SECRET is required")
if (!existsSync(chromePath)) throw new Error(`Chrome was not found at ${chromePath}`)

mkdirSync(outDir, { recursive: true })

const sql = neon(databaseUrl)

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`${options.method ?? "GET"} ${url} failed with ${response.status}`)
  }
  return response.json()
}

async function waitForChrome() {
  const versionUrl = `http://127.0.0.1:${remotePort}/json/version`
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      return await requestJson(versionUrl)
    } catch {
      await sleep(250)
    }
  }
  throw new Error("Chrome DevTools endpoint did not become ready")
}

async function createPage() {
  return requestJson(`http://127.0.0.1:${remotePort}/json/new`, { method: "PUT" })
}

async function connectToPage(page) {
  const socket = new WebSocket(page.webSocketDebuggerUrl)
  let nextId = 1
  const pending = new Map()

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data)
    if (!message.id) return

    const entry = pending.get(message.id)
    if (!entry) return

    pending.delete(message.id)
    if (message.error) {
      entry.reject(new Error(message.error.message))
    } else {
      entry.resolve(message.result)
    }
  })

  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true })
    socket.addEventListener("error", reject, { once: true })
  })

  return {
    send(method, params = {}) {
      const id = nextId
      nextId += 1
      socket.send(JSON.stringify({ id, method, params }))
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
    },
    close() {
      socket.close()
    },
  }
}

async function evaluate(client, expression, awaitPromise = false) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise,
    returnByValue: true,
  })

  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text)
  }

  return result.result.value
}

async function navigate(client, url) {
  await client.send("Page.navigate", { url })
  await evaluate(
    client,
    `
      new Promise((resolve) => {
        const done = () => document.readyState === "complete" || document.readyState === "interactive";
        if (done()) {
          resolve(true);
          return;
        }
        const tick = () => (done() ? resolve(true) : setTimeout(tick, 100));
        tick();
      })
    `,
    true
  )
  await sleep(900)
}

async function setViewport(client) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  })
}

async function installCaptureHelpers(client) {
  await client.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      (() => {
        const originalFetch = window.fetch.bind(window);
        window.fetch = async (input, init) => {
          const url = typeof input === "string" ? input : input.url;
          if (url && url.includes("/api/gemini")) {
            return new Response(JSON.stringify({
              result: "### clarify\\n\\n- 의미: 더 명확하게 설명하다\\n- 쓰임: 회의나 이메일에서 설명을 요청할 때 자연스럽게 씁니다.\\n\\n예: Could you clarify this point?"
            }), { status: 200, headers: { "Content-Type": "application/json" } });
          }
          if (url && url.includes("/api/sentences")) {
            return new Response(JSON.stringify({
              sentences: [
                { en: "Could you clarify the timeline before Friday?", ko: "금요일 전까지 일정을 명확히 설명해 주실 수 있나요?" },
                { en: "I need to clarify one more detail.", ko: "한 가지 세부 사항을 더 명확히 해야 합니다." },
                { en: "The manager clarified the next step.", ko: "매니저가 다음 단계를 명확히 설명했습니다." }
              ]
            }), { status: 200, headers: { "Content-Type": "application/json" } });
          }
          return originalFetch(input, init);
        };
      })();
    `,
  })
}

async function preparePage(client) {
  await setViewport(client)
  await client.send("Page.enable")
  await client.send("Runtime.enable")
  await client.send("Network.enable")
  await installCaptureHelpers(client)
}

async function hideAdsAndFreezeMotion(client) {
  await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const style = document.createElement("style");
        style.dataset.captureStyle = "landing";
        style.textContent = [
          "[data-ad-placement]{display:none!important}",
          "*{animation:none!important;transition:none!important;scroll-behavior:auto!important}",
          "body{background:#f8fafc!important}"
        ].join("\\n");
        document.head.appendChild(style);
      })();
    `,
  })
}

async function screenshot(client, name) {
  await hideAdsAndFreezeMotion(client)
  await sleep(300)
  const result = await client.send("Page.captureScreenshot", {
    format: "png",
    clip: { x: 0, y: 0, width: 1440, height: 1000, scale: 1 },
    captureBeyondViewport: false,
    fromSurface: true,
  })
  const file = path.join(outDir, name)
  await import("fs/promises").then(({ writeFile }) => writeFile(file, Buffer.from(result.data, "base64")))
  console.log(`Captured ${path.relative(process.cwd(), file)}`)
}

async function clickByText(client, text) {
  await evaluate(
    client,
    `
      new Promise((resolve, reject) => {
        const deadline = Date.now() + 5000;
        const tick = () => {
          const candidates = [...document.querySelectorAll("button, a")];
          const target = candidates.find((el) => el.textContent && el.textContent.includes(${JSON.stringify(text)}));
          if (target) {
            target.click();
            resolve(true);
            return;
          }
          if (Date.now() > deadline) {
            reject(new Error("Could not find clickable text: ${text}"));
            return;
          }
          setTimeout(tick, 100);
        };
        tick();
      })
    `,
    true
  )
}

async function main() {
  const [user] = await sql`
    SELECT "id", "email", "name"
    FROM "User"
    WHERE LOWER("email") = ${reviewerEmail}
    LIMIT 1
  `
  if (!user) throw new Error(`Reviewer user was not found: ${reviewerEmail}`)

  const [deck] = await sql`
    SELECT "id"
    FROM "Deck"
    WHERE "userId" = ${user.id} AND "title" = '비즈니스 이메일'
    LIMIT 1
  `
  if (!deck) throw new Error("Business English deck was not found")

  const cookieName = "authjs.session-token"
  const token = await encode({
    secret: authSecret,
    salt: cookieName,
    token: {
      id: user.id,
      sub: user.id,
      email: user.email,
      name: user.name,
    },
    maxAge: 60 * 60,
  })

  const { spawn } = await import("child_process")
  const chromeProcess = spawn(chromePath, [
    `--remote-debugging-port=${remotePort}`,
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${path.join(process.cwd(), ".tmp", "landing-screenshot-chrome")}`,
  ], { stdio: "ignore" })

  try {
    await waitForChrome()
    const page = await createPage()
    const client = await connectToPage(page)

    try {
      await preparePage(client)
      await client.send("Network.setCookie", {
        name: cookieName,
        value: token,
        domain: new URL(baseUrl).hostname,
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        expires: Math.floor(Date.now() / 1000) + 60 * 60,
      })

      await navigate(client, `${baseUrl}/dashboard`)
      await screenshot(client, "app-dashboard-clean.png")

      await navigate(client, `${baseUrl}/decks/${deck.id}/study`)
      await clickByText(client, "연습하기")
      await clickByText(client, "뜻 검색")
      await sleep(800)
      await screenshot(client, "app-study-open.png")

      await navigate(client, `${baseUrl}/essays`)
      await screenshot(client, "app-essays-clean.png")
    } finally {
      client.close()
    }
  } finally {
    chromeProcess.kill()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
