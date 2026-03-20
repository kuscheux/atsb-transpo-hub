/**
 * Copy FBX animation files from ~/Downloads → public/animations/
 *
 * Usage:
 *   node scripts/upload-animations.mjs
 *
 * Files are served statically by Next.js at /animations/<filename>
 * No storage costs, no external services needed.
 */

import { readFileSync, readdirSync, existsSync, mkdirSync, copyFileSync } from "fs"
import { join, extname } from "path"

const downloadsDir  = join(process.env.HOME, "Downloads")
const animationsDir = join(process.cwd(), "public", "animations")

// Ensure destination exists
mkdirSync(animationsDir, { recursive: true })

const fbxFiles = readdirSync(downloadsDir).filter(
  (f) => extname(f).toLowerCase() === ".fbx"
)

if (fbxFiles.length === 0) {
  console.log("⚠️  No .fbx files found in ~/Downloads")
  console.log("   Download animations from https://mixamo.com and save to ~/Downloads")
  process.exit(0)
}

console.log(`\n🎬 Found ${fbxFiles.length} FBX file(s) in ~/Downloads:\n`)
fbxFiles.forEach((f) => console.log(`   • ${f}`))
console.log()

let copied = 0

for (const fileName of fbxFiles) {
  const src  = join(downloadsDir, fileName)
  const dest = join(animationsDir, fileName)

  try {
    copyFileSync(src, dest)
    console.log(`✅  Copied → public/animations/${fileName}`)
    copied++
  } catch (err) {
    console.log(`❌  ${fileName}: ${err.message}`)
  }
}

console.log(`\n✅  ${copied} file(s) copied to public/animations/`)
console.log("   Served at: /animations/<filename>")
console.log("   Restart dev server if already running.\n")
