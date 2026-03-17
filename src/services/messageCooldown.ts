import { MessageCategory } from '../data/templates'

const MESSAGE_COOLDOWN_KEY = 'siempre_message_cooldowns_v1'
const HOURS_TO_MS = 60 * 60 * 1000

interface CooldownRecord {
  [key: string]: number
}

function normalizeRecordKey(recordKey: string): string {
  return recordKey.trim().toLowerCase()
}

function getCooldownKey(category: MessageCategory, recordKey: string): string {
  return `${category}:${normalizeRecordKey(recordKey)}`
}

function readCooldowns(): CooldownRecord {
  try {
    const raw = localStorage.getItem(MESSAGE_COOLDOWN_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as CooldownRecord
  } catch {
    return {}
  }
}

function writeCooldowns(records: CooldownRecord): void {
  try {
    localStorage.setItem(MESSAGE_COOLDOWN_KEY, JSON.stringify(records))
  } catch {
    // El bloqueo es una proteccion extra; si falla storage no bloqueamos.
  }
}

export function getRemainingCooldownMs(
  category: MessageCategory,
  recordKey: string,
  cooldownHours: number,
): number {
  const key = getCooldownKey(category, recordKey)
  const lastSentAt = readCooldowns()[key]

  if (!lastSentAt) return 0

  const cooldownMs = cooldownHours * HOURS_TO_MS
  const elapsed = Date.now() - lastSentAt
  if (elapsed >= cooldownMs) return 0

  return cooldownMs - elapsed
}

export function isMessageInCooldown(
  category: MessageCategory,
  recordKey: string,
  cooldownHours: number,
): boolean {
  return getRemainingCooldownMs(category, recordKey, cooldownHours) > 0
}

export function registerMessageSent(category: MessageCategory, recordKey: string): void {
  const records = readCooldowns()
  const key = getCooldownKey(category, recordKey)
  records[key] = Date.now()
  writeCooldowns(records)
}
