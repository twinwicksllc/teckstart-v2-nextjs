#!/usr/bin/env node
import sharp from 'sharp'

/*
Usage:
  node scripts/make-transparent-bg.mjs <input> <output> [threshold]

Examples:
  node scripts/make-transparent-bg.mjs public/teckstart-logo.png public/teckstart-logo-transparent.png 245

Notes:
- Threshold is the per-channel cutoff (0-255) above which pixels are considered background.
- Default threshold: 245 (near-white). Increase if background is slightly gray.
*/

async function main() {
  const [,, inputPath, outputPath, thresholdArg] = process.argv
  if (!inputPath || !outputPath) {
    console.error('Usage: node scripts/make-transparent-bg.mjs <input> <output> [threshold]')
    process.exit(1)
  }
  const threshold = Number.isFinite(parseInt(thresholdArg, 10)) ? parseInt(thresholdArg, 10) : 245

  const img = sharp(inputPath)
  const meta = await img.metadata()
  const { width, height } = meta
  if (!width || !height) {
    console.error('Could not read image dimensions')
    process.exit(1)
  }

  // Get RGBA buffer
  const rgba = await img.ensureAlpha().raw().toBuffer()
  const out = Buffer.alloc(rgba.length)

  for (let i = 0; i < width * height; i++) {
    const idx = i * 4
    const r = rgba[idx]
    const g = rgba[idx + 1]
    const b = rgba[idx + 2]
    const a = rgba[idx + 3]

    // Consider near-white pixels as background and make them transparent
    const isBg = r >= threshold && g >= threshold && b >= threshold
    out[idx] = r
    out[idx + 1] = g
    out[idx + 2] = b
    out[idx + 3] = isBg ? 0 : a === 0 ? 255 : a // ensure visible pixels are opaque
  }

  await sharp(out, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(outputPath)

  console.log(`Wrote transparent PNG: ${outputPath} (threshold=${threshold})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
