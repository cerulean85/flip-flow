import sharp from "sharp"
import { mkdirSync, readdirSync } from "fs"
import path from "path"

const SRC_DIR = path.join(process.cwd(), "app-store", "screenshots")
const OUT_DIR = path.join(process.cwd(), "app-store", "screenshots", "processed")
mkdirSync(OUT_DIR, { recursive: true })

// Source: 1206 x 2622 (TestFlight build screenshot from iPhone Pro Max @3x sim)
// Target: 1242 x 2688 (App Store 6.5" Display preview)
//
// Crop the iOS status bar (notch area) and the "◀ TestFlight" return bar from
// the top, then resize the remaining app content to fill the target canvas.
const SRC_WIDTH = 1206
const SRC_HEIGHT = 2622
const TOP_CROP = 200 // status bar + TestFlight bar
const TARGET_W = 1242
const TARGET_H = 2688

const files = readdirSync(SRC_DIR)
  .filter((f) => /^IMG_\d+\.PNG$/i.test(f))
  .sort()

if (files.length === 0) {
  console.error("No IMG_*.PNG sources found in", SRC_DIR)
  process.exit(1)
}

for (const f of files) {
  const inPath = path.join(SRC_DIR, f)
  const outName = f.replace(/\.png$/i, "-1242x2688.png")
  const outPath = path.join(OUT_DIR, outName)

  await sharp(inPath)
    .extract({
      left: 0,
      top: TOP_CROP,
      width: SRC_WIDTH,
      height: SRC_HEIGHT - TOP_CROP,
    })
    .resize(TARGET_W, TARGET_H, { fit: "fill" })
    .png()
    .toFile(outPath)
  console.log(`✓ ${outName}`)
}
