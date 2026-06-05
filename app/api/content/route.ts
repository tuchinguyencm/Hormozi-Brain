import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export type FileItem = {
  id: string
  label: string
  path: string
  ext: 'md' | 'txt'
}

export type Category = {
  id: string
  label: string
  files: FileItem[]
}

const PLAYBOOK_FRIENDLY: Record<string, string> = {
  'Branding': '🏷 Branding',
  'Closing': '📞 Closing',
  'Fast Cash': '⚡ Fast Cash',
  'GOATed Ads': '📢 GOATed Ads',
  'Hooks': '🪝 Hooks',
  'Lead Nurture': '🌱 Lead Nurture',
  'Lifetime Value': '♾ Lifetime Value',
  'Marketing Machine': '⚙️ Marketing Machine',
  'Price Raise': '📈 Price Raise',
  'Pricing': '💰 Pricing',
  'Proof Checklist': '✅ Proof Checklist',
  'Retention': '🔄 Retention',
}

const TRANSCRIPT_FRIENDLY: Record<string, string> = {
  '00-improvise-v2': '00. Improvise v2',
  'lesson01-start-here': '01. Start Here',
  'lesson02-context': '02. Context',
  'lesson03-stage0-improvise': '03. Stage 0: Improvise ($0-$100K)',
  'lesson04-stage1-monetize': '04. Stage 1: Monetize',
  'lesson05-stage2-advertise': '05. Stage 2: Advertise ($100K-$250K)',
  'lesson06-stage3-stabilize': '06. Stage 3: Stabilize ($250K-$500K)',
  'lesson07-stage4-prioritize': '07. Stage 4: Prioritize ($500K-$1M)',
  'lesson08-stage5-productize': '08. Stage 5: Productize ($1M-$2M)',
  'lesson09-stage6-optimize': '09. Stage 6: Optimize ($2M-$3M)',
  'lesson10-stage7-categorize': '10. Stage 7: Categorize ($3M-$5M)',
  'lesson11-stage8-specialize': '11. Stage 8: Specialize ($5M-$10M)',
  'lesson12-stage9-capitalize': '12. Stage 9: Capitalize ($10M+)',
  'lesson13-free-bonus': '13. Free Bonus',
}

const PROMPT_FRIENDLY: Record<string, string> = {
  '01-grand-slam-offer-builder': '01. Grand Slam Offer Builder',
  '02-sales-script-generator': '02. Sales Script Generator',
  '03-lead-nurture-sequence': '03. Lead Nurture Sequence',
  '04-price-raise-playbook': '04. Price Raise Playbook',
  '05-ad-hook-generator': '05. Ad Hook Generator',
}

function getPlaybookLabel(filename: string): string {
  const match = filename.match(/Playbook_\s+(.+?)\s+--/)
  if (match) {
    const key = match[1].trim()
    return PLAYBOOK_FRIENDLY[key] ?? key
  }
  return filename
}

export async function GET() {
  const categories: Category[] = []

  // Playbooks
  const playbookDir = path.join(CONTENT_DIR, 'playbooks')
  if (fs.existsSync(playbookDir)) {
    const files = fs.readdirSync(playbookDir).filter(f => f.endsWith('.md'))
    categories.push({
      id: 'playbooks',
      label: '📚 Playbooks',
      files: files.map(f => ({
        id: f,
        label: getPlaybookLabel(f),
        path: `playbooks/${f}`,
        ext: 'md',
      })),
    })
  }

  // Course transcripts
  const transcriptDir = path.join(CONTENT_DIR, 'course-transcripts')
  if (fs.existsSync(transcriptDir)) {
    const files = fs.readdirSync(transcriptDir).filter(f => f.endsWith('.txt')).sort()
    categories.push({
      id: 'transcripts',
      label: '🎯 Scaling Course',
      files: files.map(f => {
        const base = f.replace('.txt', '')
        return {
          id: f,
          label: TRANSCRIPT_FRIENDLY[base] ?? base,
          path: `course-transcripts/${f}`,
          ext: 'txt',
        }
      }),
    })
  }

  // Frameworks
  const frameworkDir = path.join(CONTENT_DIR, 'frameworks')
  if (fs.existsSync(frameworkDir)) {
    const files = fs.readdirSync(frameworkDir).filter(f => f.endsWith('.md'))
    categories.push({
      id: 'frameworks',
      label: '🛠 Frameworks',
      files: files.map(f => ({
        id: f,
        label: '📋 ' + f.replace('.md', '').replace(/-/g, ' '),
        path: `frameworks/${f}`,
        ext: 'md',
      })),
    })
  }

  // Prompts
  const promptDir = path.join(CONTENT_DIR, 'prompts')
  if (fs.existsSync(promptDir)) {
    const files = fs.readdirSync(promptDir).filter(f => f.endsWith('.md')).sort()
    categories.push({
      id: 'prompts',
      label: '💡 Prompts',
      files: files.map(f => {
        const base = f.replace('.md', '')
        return {
          id: f,
          label: PROMPT_FRIENDLY[base] ?? base,
          path: `prompts/${f}`,
          ext: 'md',
        }
      }),
    })
  }

  return NextResponse.json({ categories })
}
