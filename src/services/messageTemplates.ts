import { messageTemplates, MessageCategory } from '../data/templates'

const TEMPLATE_POOL_KEY = 'siempre_template_pool_v1'

type TemplatePools = Partial<Record<MessageCategory, number[]>>

function readPools(): TemplatePools {
  try {
    const raw = localStorage.getItem(TEMPLATE_POOL_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as TemplatePools
  } catch {
    return {}
  }
}

function writePools(pools: TemplatePools): void {
  try {
    localStorage.setItem(TEMPLATE_POOL_KEY, JSON.stringify(pools))
  } catch {
    // No interrumpimos el flujo si el storage no esta disponible.
  }
}

function buildShuffledPool(length: number): number[] {
  const pool = Array.from({ length }, (_, index) => index)

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = pool[index]
    pool[index] = pool[swapIndex]
    pool[swapIndex] = current
  }

  return pool
}

function getValidPool(category: MessageCategory, variantCount: number, pools: TemplatePools): number[] {
  const storedPool = pools[category] ?? []
  const validPool = storedPool.filter(
    (index) => Number.isInteger(index) && index >= 0 && index < variantCount,
  )

  return validPool.length > 0 ? validPool : buildShuffledPool(variantCount)
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function getNextTemplate(category: MessageCategory, phone: string): string {
  void phone
  const variants = messageTemplates[category]

  if (variants.length === 0) return ''

  const pools = readPools()
  const pool = getValidPool(category, variants.length, pools)
  const index = pool.shift()

  pools[category] = pool
  writePools(pools)

  return variants[index ?? 0]
}

export function interpolateTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\$\{([^}]+)\}/g, (_, token: string) => {
    const value = values[token]
    return value ?? ''
  })
}
