import fs from 'fs'
import path from 'path'
import { PLAYBOOK_LABELS, STAGE_LABELS } from '@/lib/constants'

export { PLAYBOOK_LABELS, STAGE_LABELS }

const CONTENT_DIR = path.join(process.cwd(), 'content')

export type KnowledgeSource = {
  id: string
  label: string
  category: 'playbook' | 'transcript' | 'framework'
  content: string
}

const PLAYBOOK_MAP: Record<string, string> = {
  pricing: '$100M Playbook_ Pricing -- Alex Hormozi -- $100M, 2025.md',
  closing: '$100M Playbook_ Closing -- Alex Hormozi -- $100M, 2025.md',
  'fast-cash': '$100M Playbook_ Fast Cash -- Alex Hormozi -- $100M, 2025.md',
  'goated-ads': '$100M Playbook_ GOATed Ads -- Alex Hormozi -- 2025.md',
  hooks: '$100M Playbook_ Hooks -- Alex Hormozi -- $100M, 2025.md',
  'lead-nurture': '$100M Playbook_ Lead Nurture -- Alex Hormozi -- $100M, 2025.md',
  'lifetime-value': '$100M Playbook_ Lifetime Value -- Alex Hormozi -- 2025.md',
  'marketing-machine': '$100M Playbook_ Marketing Machine -- Alex Hormozi -- $100M, 2025.md',
  'price-raise': '$100M Playbook_ Price Raise -- Alex Hormozi -- $100M, 2025.md',
  'proof-checklist': '$100M Playbook_ Proof Checklist -- Alex Hormozi -- $100M, 2025.md',
  retention: '$100M Playbook_ Retention -- Alex Hormozi -- $100M, 2025.md',
  branding: '$100M Playbook_ Branding -- Alex Hormozi -- $100M, 2025.md',
}

const TRANSCRIPT_MAP: Record<string, string> = {
  lesson03: 'lesson03-stage0-improvise.txt',
  lesson04: 'lesson04-stage1-monetize.txt',
  lesson05: 'lesson05-stage2-advertise.txt',
  lesson06: 'lesson06-stage3-stabilize.txt',
  lesson07: 'lesson07-stage4-prioritize.txt',
  lesson08: 'lesson08-stage5-productize.txt',
  lesson09: 'lesson09-stage6-optimize.txt',
  lesson10: 'lesson10-stage7-categorize.txt',
  lesson11: 'lesson11-stage8-specialize.txt',
  lesson12: 'lesson12-stage9-capitalize.txt',
}

function readFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch {
    return ''
  }
}

export function loadPlaybook(id: string): KnowledgeSource | null {
  const filename = PLAYBOOK_MAP[id]
  if (!filename) return null
  const content = readFile(path.join(CONTENT_DIR, 'playbooks', filename))
  if (!content) return null
  return { id, label: PLAYBOOK_LABELS[id], category: 'playbook', content }
}

export function loadTranscript(id: string): KnowledgeSource | null {
  const filename = TRANSCRIPT_MAP[id]
  if (!filename) return null
  const content = readFile(path.join(CONTENT_DIR, 'course-transcripts', filename))
  if (!content) return null
  return { id, label: STAGE_LABELS[id], category: 'transcript', content }
}

export function loadFramework(): KnowledgeSource | null {
  const content = readFile(path.join(CONTENT_DIR, 'frameworks', 'copywriting-frameworks.md'))
  if (!content) return null
  return { id: 'copywriting', label: 'Copywriting Frameworks', category: 'framework', content }
}

export function loadSources(playbookIds: string[], transcriptIds: string[]): KnowledgeSource[] {
  const sources: KnowledgeSource[] = []
  for (const id of playbookIds) {
    const s = loadPlaybook(id)
    if (s) sources.push(s)
  }
  for (const id of transcriptIds) {
    const s = loadTranscript(id)
    if (s) sources.push(s)
  }
  return sources
}

export function buildSystemPrompt(sources: KnowledgeSource[]): string {
  const knowledgeBlocks = sources.map(s => {
    const header = s.category === 'playbook'
      ? `=== PLAYBOOK: ${s.label} ===`
      : s.category === 'transcript'
      ? `=== SCALING TRANSCRIPT: ${s.label} ===`
      : `=== FRAMEWORK: ${s.label} ===`
    return `${header}\n\n${s.content}`
  }).join('\n\n---\n\n')

  return `Bạn là cố vấn kinh doanh được lập trình theo framework $100M của Alex Hormozi.
Trả lời hoàn toàn bằng tiếng Việt, trừ các thuật ngữ chuyên môn (giữ nguyên tiếng Anh).

NGUYÊN TẮC TRẢ LỜI:
- Trực tiếp, không rào đón
- Dẫn ra framework cụ thể từ tài liệu
- Đưa ra bước hành động cụ thể có thể thực hiện ngay hôm nay
- Dùng số liệu và ví dụ cụ thể
- Format: đánh số các bước hành động

${knowledgeBlocks ? `TÀI LIỆU THAM KHẢO:\n\n${knowledgeBlocks}` : ''}`
}
