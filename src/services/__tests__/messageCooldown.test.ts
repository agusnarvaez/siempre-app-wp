import { describe, expect, it, beforeEach, vi } from 'vitest'
import { getRemainingCooldownMs, isMessageInCooldown, registerMessageSent } from '../messageCooldown'

describe('messageCooldown', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useRealTimers()
  })

  it('registra envio y activa cooldown para ese registro', () => {
    registerMessageSent('posventa', 'cod-1:0')

    expect(isMessageInCooldown('posventa', 'cod-1:0', 24)).toBe(true)
    expect(isMessageInCooldown('posventa', 'cod-2:0', 24)).toBe(false)
  })

  it('calcula remaining ms y expira al superar el tiempo', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-17T10:00:00.000Z'))

    registerMessageSent('posventa', 'cod-1:0')
    const withCooldown = getRemainingCooldownMs('posventa', 'cod-1:0', 24)
    expect(withCooldown).toBeGreaterThan(0)

    vi.setSystemTime(new Date('2026-03-18T11:00:00.000Z'))
    const expired = getRemainingCooldownMs('posventa', 'cod-1:0', 24)
    expect(expired).toBe(0)
  })
})
