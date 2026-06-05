export const PLAYBOOK_LABELS: Record<string, string> = {
  pricing: 'Pricing',
  closing: 'Closing',
  'fast-cash': 'Fast Cash',
  'goated-ads': 'GOATed Ads',
  hooks: 'Hooks',
  'lead-nurture': 'Lead Nurture',
  'lifetime-value': 'Lifetime Value',
  'marketing-machine': 'Marketing Machine',
  'price-raise': 'Price Raise',
  'proof-checklist': 'Proof Checklist',
  retention: 'Retention',
  branding: 'Branding',
}

export const STAGE_LABELS: Record<string, string> = {
  lesson03: 'Stage 0: Improvise ($0-$100K)',
  lesson04: 'Stage 1: Monetize (đến $100K)',
  lesson05: 'Stage 2: Advertise ($100K-$250K)',
  lesson06: 'Stage 3: Stabilize ($250K-$500K)',
  lesson07: 'Stage 4: Prioritize ($500K-$1M)',
  lesson08: 'Stage 5: Productize ($1M-$2M)',
  lesson09: 'Stage 6: Optimize ($2M-$3M)',
  lesson10: 'Stage 7: Categorize ($3M-$5M)',
  lesson11: 'Stage 8: Specialize ($5M-$10M)',
  lesson12: 'Stage 9: Capitalize ($10M+)',
}

export const STAGE_OPTIONS = [
  { value: '', label: '-- Chọn giai đoạn doanh thu --' },
  { value: '$0', label: 'Stage 0 — $0 (chưa bắt đầu)' },
  { value: '100k', label: 'Stage 1 — $0-$100K' },
  { value: '250k', label: 'Stage 2 — $100K-$250K' },
  { value: '500k', label: 'Stage 3 — $250K-$500K' },
  { value: '800k', label: 'Stage 4 — $500K-$1M' },
  { value: '1.5m', label: 'Stage 5 — $1M-$2M' },
  { value: '3m', label: 'Stage 6 — $2M-$3M' },
  { value: '4m', label: 'Stage 7 — $3M-$5M' },
  { value: '10m', label: 'Stage 8 — $5M-$10M' },
  { value: 'capitalize', label: 'Stage 9 — $10M+' },
]
