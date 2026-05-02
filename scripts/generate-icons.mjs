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

const splashSvg = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect x="236" y="300" width="552" height="424" rx="88" fill="white" fill-opacity="0.35" transform="rotate(-12 512 512)"/>
  <rect x="236" y="300" width="552" height="424" rx="88" fill="white" transform="rotate(8 512 512)"/>
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
    .resize(1024, 1024)
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
