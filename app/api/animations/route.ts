import { NextResponse } from "next/server"
import { readdirSync, statSync } from "fs"
import { join } from "path"

export async function GET() {
  const dir = join(process.cwd(), "public", "animations")

  let files: string[]
  try {
    files = readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".fbx"))
  } catch {
    return NextResponse.json({ animations: [] })
  }

  const animations = files.sort().map((fileName) => {
    const size = statSync(join(dir, fileName)).size
    return {
      name: fileName
        .replace(/\.fbx$/i, "")
        .replace(/\b\w/g, (c) => c.toUpperCase()),   // "Dancing Twerk" stays as-is
      slug: fileName,
      url:  `/animations/${encodeURIComponent(fileName)}`, // served by Next.js static
      size,
    }
  })

  return NextResponse.json({ animations })
}
