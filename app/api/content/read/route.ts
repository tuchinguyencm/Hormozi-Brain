import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const filePath = searchParams.get('path')

  if (!filePath) {
    return NextResponse.json({ error: 'Missing path' }, { status: 400 })
  }

  // Ngăn path traversal
  const resolved = path.resolve(CONTENT_DIR, filePath)
  if (!resolved.startsWith(CONTENT_DIR)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 403 })
  }

  try {
    const content = fs.readFileSync(resolved, 'utf-8')
    return NextResponse.json({ content })
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
