import { messageTemplates, MessageCategory } from '../data/templates'

const TEMPLATE_COUNTERS_KEY = 'siempre_template_counters_v1'

type TemplateCounters = Record<string, number>

function readCounters(): TemplateCounters {
  try {
    const raw = localStorage.getItem(TEMPLATE_COUNTERS_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as TemplateCounters
  } catch {
    return {}
  }
}

function writeCounters(counters: TemplateCounters): void {
  try {
    localStorage.setItem(TEMPLATE_COUNTERS_KEY, JSON.stringify(counters))
  } catch {
    // No interrumpimos el flujo si el storage no esta disponible.
  }
}

function getCounterKey(category: MessageCategory, phone: string): string {
  return `${category}:${phone}`
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function getNextTemplate(category: MessageCategory, phone: string): string {
  const normalizedPhone = normalizePhone(phone)
  const variants = messageTemplates[category]

  if (variants.length === 0) return ''

  const counters = readCounters()
  const key = getCounterKey(category, normalizedPhone)
  const currentCount = counters[key] ?? 0
  const index = currentCount % variants.length

  counters[key] = currentCount + 1
  writeCounters(counters)

  return variants[index]
}

export function interpolateTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\$\{([^}]+)\}/g, (_, token: string) => {
    const value = values[token]
    return value ?? ''
  })
}
