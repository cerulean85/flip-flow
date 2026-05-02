import sharp from "sharp"
import { mkdirSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const iconsDir = path.join(__dirname, "../public/icons")
const mobileAssetsDir = path.join(__dirname, "../mobile/assets")
mkdirSync(iconsDir, { recursive: true })
mkdirSync(mobileAssetsDir, { recursive: true })

// Standard icon SVG — gradient background + two layered cards (matches Logo.tsx)
const iconSvg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ff-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="24" fill="url(#ff-bg)"/>
  <rect x="22" y="28" width="56" height="44" rx="8" fill="white" fill-opacity="0.35" transform="rotate(-12 50 50)"/>
  <rect x="22" y="28" width="56" height="44" rx="8" fill="white" transform="rotate(8 50 50)"/>
</svg>`

// Maskable icon: safe zone is inner 80%, scale content to ~72% and fill the entire square
const maskableSvg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ff-bg-mask" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" fill="url(#ff-bg-mask)"/>
  <g transform="translate(14 14) scale(0.72)">
    <rect x="22" y="28" width="56" height="44" rx="8" fill="white" fill-opacity="0.35" transform="rotate(-12 50 50)"/>
    <rect x="22" y="28" width="56" height="44" rx="8" fill="white" transform="rotate(8 50 50)"/>
  </g>
</svg>`

const sizes = [192, 512]

const mobileIconSvg = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ff-mobile-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#ff-mobile-bg)"/>
  <rect x="236" y="300" width="552" height="424" rx="88" fill="white" fill-opacity="0.35" transform="rotate(-12 512 512)"/>
  <rect x="236" y="300" width="552" height="424" rx="88" fill="white" transform="rotate(8 512 512)"/>
</svg>`

// Splash icon — full-screen canvas (1242x2688, iPhone Pro Max @3x) with
// background painted in and the card mark sized small at screen center. Native
// splash composers (Expo / iOS storyboard) display this image at screen size,
// so the content size is fixed regardless of imageWidth/resizeMode quirks.
const SPLASH_W = 1242
const SPLASH_H = 2688
const CARD_W = 420
const CARD_H = 320
const CARD_X = (SPLASH_W - CARD_W) / 2
const CARD_Y = (SPLASH_H - CARD_H) / 2
const CARD_CX = SPLASH_W / 2
const CARD_CY = SPLASH_H / 2
const splashSvg = `<svg viewBox="0 0 ${SPLASH_W} ${SPLASH_H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${SPLASH_W}" height="${SPLASH_H}" fill="#3b82f6"/>
  <rect x="${CARD_X}" y="${CARD_Y}" width="${CARD_W}" height="${CARD_H}" rx="60" fill="white" fill-opacity="0.35" transform="rotate(-12 ${CARD_CX} ${CARD_CY})"/>
  <rect x="${CARD_X}" y="${CARD_Y}" width="${CARD_W}" height="${CARD_H}" rx="60" fill="white" transform="rotate(8 ${CARD_CX} ${CARD_CY})"/>
</svg>`

async function generate() {
  for (const size of sizes) {
    await sharp(Buffer.from(iconSvg))
      .resize(size, size)
      .png()
      .toFile(path.join(iconsDir, `icon-${size}.png`))
    console.log(`✓ icon-${size}.png`)

    await sharp(Buffer.from(maskableSvg))
      .resize(size, size)
      .png()
      .toFile(path.join(iconsDir, `icon-${size}-maskable.png`))
    console.log(`✓ icon-${size}-maskable.png`)
  }

  // Apple touch icon (180x180)
  await sharp(Buffer.from(iconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(iconsDir, `apple-touch-icon.png`))
  console.log("✓ apple-touch-icon.png")

  await sharp(Buffer.from(mobileIconSvg))
    .resize(1024, 1024)
    .flatten({ background: "#3b82f6" })
    .removeAlpha()
    .png()
    .toFile(path.join(mobileAssetsDir, "icon.png"))
  console.log("✓ mobile icon.png")

  await sharp(Buffer.from(mobileIconSvg))
    .resize(1024, 1024)
    .flatten({ background: "#3b82f6" })
    .removeAlpha()
    .png()
    .toFile(path.join(mobileAssetsDir, "adaptive-icon.png"))
  console.log("✓ mobile adaptive-icon.png")

  await sharp(Buffer.from(splashSvg))
    .resize(SPLASH_W, SPLASH_H)
    .png()
    .toFile(path.join(mobileAssetsDir, "splash-icon.png"))
  console.log("✓ mobile splash-icon.png")

  await sharp(Buffer.from(mobileIconSvg))
    .resize(192, 192)
    .flatten({ background: "#3b82f6" })
    .removeAlpha()
    .png()
    .toFile(path.join(mobileAssetsDir, "favicon.png"))
  console.log("✓ mobile favicon.png")
}

generate().catch(console.error)
