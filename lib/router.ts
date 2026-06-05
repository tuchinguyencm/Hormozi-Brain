// Smart router: phân tích câu hỏi → chọn đúng playbook và transcript
export { PLAYBOOK_LABELS, STAGE_LABELS, STAGE_OPTIONS } from '@/lib/constants'

export type RouterResult = {
  playbooks: string[]
  transcripts: string[]
}

type Rule = {
  keywords: string[]
  playbooks: string[]
}

const TOPIC_RULES: Rule[] = [
  {
    keywords: ['offer', 'gói', 'package', 'sản phẩm', 'dịch vụ', 'tạo offer', 'đóng gói', 'grand slam', 'value equation'],
    playbooks: ['pricing', 'fast-cash'],
  },
  {
    keywords: ['giá', 'price', 'pricing', 'charge', 'tính giá', 'định giá'],
    playbooks: ['pricing'],
  },
  {
    keywords: ['bán hàng', 'closing', 'close', 'sales', 'script', 'kịch bản', 'discovery call', 'cuộc gọi', 'chốt sale', 'chốt đơn'],
    playbooks: ['closing'],
  },
  {
    keywords: ['tiền nhanh', 'fast cash', 'doanh thu nhanh', '48 giờ', 'cash flow', 'dòng tiền', 'khẩn cấp'],
    playbooks: ['fast-cash'],
  },
  {
    keywords: ['quảng cáo', 'ad', 'ads', 'facebook ads', 'creative', 'copy', 'goated', 'viết quảng cáo'],
    playbooks: ['goated-ads', 'hooks'],
  },
  {
    keywords: ['hook', 'attention', 'scroll', 'tiêu đề', 'headline', 'dừng lại', 'viral'],
    playbooks: ['hooks'],
  },
  {
    keywords: ['lead', 'nurture', 'follow up', 'email', 'sequence', 'nurturing', 'cold lead', 'khách lạnh'],
    playbooks: ['lead-nurture'],
  },
  {
    keywords: ['ltv', 'lifetime value', 'giá trị vòng đời', 'upsell', 'cross sell', 'repeat', 'quay lại mua'],
    playbooks: ['lifetime-value'],
  },
  {
    keywords: ['marketing', 'lead gen', 'khách hàng tiềm năng', 'hệ thống marketing', 'tự động', 'automation', 'machine'],
    playbooks: ['marketing-machine'],
  },
  {
    keywords: ['tăng giá', 'raise price', 'charge more', 'tăng phí', 'giá cao hơn', 'nâng giá'],
    playbooks: ['price-raise', 'pricing'],
  },
  {
    keywords: ['social proof', 'testimonial', 'đánh giá', 'review', 'case study', 'bằng chứng', 'proof'],
    playbooks: ['proof-checklist'],
  },
  {
    keywords: ['retention', 'giữ chân', 'churn', 'rời bỏ', 'giảm churn', 'khách ở lại', 'loyalty'],
    playbooks: ['retention'],
  },
  {
    keywords: ['branding', 'thương hiệu', 'brand', 'định vị', 'positioning', 'nhận diện'],
    playbooks: ['branding'],
  },
  {
    keywords: ['copywriting', 'viết lách', 'content', 'nội dung', 'bài viết', 'landing page', 'sales page'],
    playbooks: ['goated-ads'],
  },
]

const REVENUE_STAGE_MAP: Array<{ keywords: string[]; transcripts: string[] }> = [
  { keywords: ['0', '$0', 'bắt đầu', 'mới bắt đầu', 'chưa có doanh thu', 'improvise'], transcripts: ['lesson03', 'lesson04'] },
  { keywords: ['100k', '$100k', '100.000', 'monetize'], transcripts: ['lesson04', 'lesson05'] },
  { keywords: ['200k', '250k', '$200k', '$250k', 'advertise'], transcripts: ['lesson05'] },
  { keywords: ['300k', '400k', '500k', '$300k', '$400k', '$500k', 'stabilize'], transcripts: ['lesson06'] },
  { keywords: ['600k', '700k', '800k', '900k', '1m', '$1m', '1 triệu', 'prioritize'], transcripts: ['lesson07'] },
  { keywords: ['1.5m', '$1.5m', '2m', '$2m', 'productize', '2 triệu'], transcripts: ['lesson08'] },
  { keywords: ['3m', '$3m', 'optimize', '3 triệu'], transcripts: ['lesson09'] },
  { keywords: ['4m', '5m', '$4m', '$5m', 'categorize', '4 triệu', '5 triệu'], transcripts: ['lesson10'] },
  { keywords: ['6m', '7m', '8m', '9m', '10m', '$10m', 'specialize', '10 triệu'], transcripts: ['lesson11'] },
  { keywords: ['capitalize', 'hơn 10m', '20m', '50m', 'enterprise'], transcripts: ['lesson12'] },
]

export function routeQuestion(question: string, revenueStage?: string): RouterResult {
  const q = question.toLowerCase()
  const playbooks = new Set<string>()
  const transcripts = new Set<string>()

  for (const rule of TOPIC_RULES) {
    if (rule.keywords.some(kw => q.includes(kw))) {
      rule.playbooks.forEach(p => playbooks.add(p))
    }
  }

  // Nếu không match gì → dùng pricing + closing làm default
  if (playbooks.size === 0) {
    playbooks.add('pricing')
    playbooks.add('closing')
  }

  // Revenue stage từ selector hoặc từ câu hỏi
  if (revenueStage) {
    const match = REVENUE_STAGE_MAP.find(r => r.keywords.some(kw => revenueStage.toLowerCase().includes(kw)))
    if (match) match.transcripts.forEach(t => transcripts.add(t))
  } else {
    for (const stage of REVENUE_STAGE_MAP) {
      if (stage.keywords.some(kw => q.includes(kw))) {
        stage.transcripts.forEach(t => transcripts.add(t))
        break
      }
    }
  }

  return {
    playbooks: Array.from(playbooks).slice(0, 3),
    transcripts: Array.from(transcripts).slice(0, 2),
  }
}

