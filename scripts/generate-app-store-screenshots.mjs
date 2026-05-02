import { mkdirSync } from "fs"
import path from "path"
import sharp from "sharp"

const outDir = path.join(process.cwd(), "app-store", "screenshots")
mkdirSync(outDir, { recursive: true })

const logo = `
  <defs>
    <linearGradient id="logo-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
  <rect width="124" height="124" rx="30" fill="url(#logo-bg)"/>
  <rect x="27" y="36" width="70" height="52" rx="10" fill="white" fill-opacity="0.35" transform="rotate(-12 62 62)"/>
  <rect x="27" y="36" width="70" height="52" rx="10" fill="white" transform="rotate(8 62 62)"/>
`

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function roundedRect(x, y, w, h, r, fill, stroke = "none", strokeWidth = 0) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`
}

function text(value, x, y, size, fill, weight = 700, anchor = "start") {
  return `<text x="${x}" y="${y}" font-family="Pretendard, Apple SD Gothic Neo, Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(value)}</text>`
}

function cardRow(x, y, w, front, back, color, marked = false) {
  return `
    ${roundedRect(x, y, w, 96, 24, "#ffffff", "#e5e7eb", 2)}
    ${roundedRect(x + 22, y + 24, 8, 48, 4, color)}
    ${text(front, x + 50, y + 42, 25, "#111827", 800)}
    ${text(back, x + 50, y + 74, 21, "#6b7280", 600)}
    ${marked ? text("★", x + w - 54, y + 62, 28, "#f59e0b", 800) : ""}
  `
}

function phoneMockup(x, y, w, h, variant = "cards") {
  const screenX = x + 28
  const screenY = y + 28
  const screenW = w - 56
  const screenH = h - 56
  const contentW = screenW - 64

  const cards =
    variant === "essay"
      ? `
        ${text("에세이 노트", screenX + 32, screenY + 118, 44, "#111827", 850)}
        ${text("짧게 쓰고, 바로 복습하기", screenX + 32, screenY + 162, 24, "#6b7280", 600)}
        ${roundedRect(screenX + 32, screenY + 210, contentW, 330, 30, "#ffffff", "#e5e7eb", 2)}
        ${text("A Small Habit", screenX + 62, screenY + 270, 34, "#111827", 850)}
        ${text("I started writing one short", screenX + 62, screenY + 326, 24, "#374151", 600)}
        ${text("sentence for every expression.", screenX + 62, screenY + 364, 24, "#374151", 600)}
        ${text("This small habit helped me", screenX + 62, screenY + 402, 24, "#374151", 600)}
        ${text("remember the context.", screenX + 62, screenY + 440, 24, "#374151", 600)}
        ${roundedRect(screenX + 32, screenY + 584, contentW, 84, 24, "#eff6ff")}
        ${text("AI 문장 생성", screenX + 62, screenY + 638, 28, "#2563eb", 800)}
        ${roundedRect(screenX + 32, screenY + 700, contentW, 84, 24, "#f0fdf4")}
        ${text("뜻 검색과 예문", screenX + 62, screenY + 754, 28, "#16a34a", 800)}
      `
      : `
        ${text("오늘의 카드", screenX + 32, screenY + 118, 44, "#111827", 850)}
        ${text("중요 표현만 빠르게 정리", screenX + 32, screenY + 162, 24, "#6b7280", 600)}
        ${roundedRect(screenX + 32, screenY + 206, contentW, 188, 32, "#2563eb")}
        ${text("Could you clarify", screenX + 62, screenY + 282, 34, "#ffffff", 850)}
        ${text("this point?", screenX + 62, screenY + 326, 34, "#ffffff", 850)}
        ${text("이 부분을 명확히 설명해 주실 수 있나요?", screenX + 62, screenY + 368, 20, "#dbeafe", 650)}
        ${cardRow(screenX + 32, screenY + 430, contentW, "That makes sense.", "말이 되네요.", "#10b981", true)}
        ${cardRow(screenX + 32, screenY + 548, contentW, "I will keep you posted.", "계속 공유드리겠습니다.", "#f59e0b")}
        ${cardRow(screenX + 32, screenY + 666, contentW, "Let's figure it out.", "같이 해결해 봅시다.", "#8b5cf6")}
      `

  return `
    ${roundedRect(x, y, w, h, 64, "#0f172a")}
    ${roundedRect(screenX, screenY, screenW, screenH, 44, "#f8fafc")}
    <circle cx="${x + w / 2}" cy="${y + 34}" r="7" fill="#1f2937"/>
    <g transform="translate(${screenX + 32}, ${screenY + 28}) scale(0.44)">${logo}</g>
    ${cards}
  `
}

function portraitSvg(width, height) {
  const phoneW = Math.round(width * 0.68)
  const phoneH = Math.round(height * 0.55)
  const phoneX = Math.round((width - phoneW) / 2)
  const phoneY = Math.round(height * 0.36)

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="48%" stop-color="#111827"/>
          <stop offset="100%" stop-color="#064e3b"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="34" stdDeviation="28" flood-color="#000000" flood-opacity="0.35"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <g transform="translate(${Math.round(width / 2 - 62)}, ${Math.round(height * 0.09)})">${logo}</g>
      ${text("Flip & Flow", width / 2, Math.round(height * 0.19), 82, "#ffffff", 900, "middle")}
      ${text("암기 흐름을 한눈에 정리하세요", width / 2, Math.round(height * 0.235), 43, "#bfdbfe", 750, "middle")}
      ${text("카드, 북마크, 에세이까지 심플하게", width / 2, Math.round(height * 0.275), 31, "#d1d5db", 600, "middle")}
      <g filter="url(#shadow)">${phoneMockup(phoneX, phoneY, phoneW, phoneH, "cards")}</g>
    </svg>
  `
}

function landscapeSvg(width, height) {
  const phoneW = Math.round(width * 0.34)
  const phoneH = Math.round(height * 0.78)
  const phoneY = Math.round((height - phoneH) / 2)

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="55%" stop-color="#172554"/>
          <stop offset="100%" stop-color="#0f766e"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="26" stdDeviation="24" flood-color="#000000" flood-opacity="0.35"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <g transform="translate(${Math.round(width * 0.075)}, ${Math.round(height * 0.16)})">${logo}</g>
      ${text("기억할 것만 남기는", Math.round(width * 0.075), Math.round(height * 0.39), 70, "#ffffff", 900)}
      ${text("나만의 플래시카드", Math.round(width * 0.075), Math.round(height * 0.49), 70, "#ffffff", 900)}
      ${text("단어장, 예문, 에세이 노트를 한 앱에서 정리하세요.", Math.round(width * 0.075), Math.round(height * 0.59), 30, "#cbd5e1", 600)}
      ${roundedRect(Math.round(width * 0.075), Math.round(height * 0.68), 360, 76, 38, "#3b82f6")}
      ${text("App Review Demo Ready", Math.round(width * 0.075) + 180, Math.round(height * 0.68) + 49, 26, "#ffffff", 800, "middle")}
      <g filter="url(#shadow)">${phoneMockup(Math.round(width * 0.51), phoneY, phoneW, phoneH, "cards")}</g>
      <g filter="url(#shadow)" opacity="0.96">${phoneMockup(Math.round(width * 0.68), phoneY + 34, phoneW, phoneH, "essay")}</g>
    </svg>
  `
}

const screenshots = [
  { name: "iphone-65-portrait-1242x2688.png", width: 1242, height: 2688, svg: portraitSvg },
  { name: "iphone-65-landscape-2688x1242.png", width: 2688, height: 1242, svg: landscapeSvg },
  { name: "iphone-69-portrait-1284x2778.png", width: 1284, height: 2778, svg: portraitSvg },
  { name: "iphone-69-landscape-2778x1284.png", width: 2778, height: 1284, svg: landscapeSvg },
]

for (const shot of screenshots) {
  const file = path.join(outDir, shot.name)
  await sharp(Buffer.from(shot.svg(shot.width, shot.height))).png().toFile(file)
  console.log(`✓ ${shot.name}`)
}
