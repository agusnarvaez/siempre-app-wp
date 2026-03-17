import { describe, expect, it, beforeEach } from 'vitest'
import { getNextTemplate, interpolateTemplate, normalizePhone } from '../messageTemplates'

describe('messageTemplates', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('normaliza telefono removiendo caracteres no numericos', () => {
    expect(normalizePhone('+54 9 11-2233-4455')).toBe('5491122334455')
  })

  it('rota templates por telefono y categoria', () => {
    const first = getNextTemplate('posventa', '11-1234-5678')
    const second = getNextTemplate('posventa', '11-1234-5678')

    expect(first.length).toBeGreaterThan(0)
    expect(second.length).toBeGreaterThan(0)
    expect(second).not.toBe(first)
  })

  it('interpela placeholders disponibles y deja vacio faltantes', () => {
    const template = 'Hola ${row.Destinatario}, ${saludo}! ${missing}'
    const text = interpolateTemplate(template, {
      'row.Destinatario': 'Juan',
      saludo: 'Buenas tardes',
    })

    expect(text).toContain('Hola Juan, Buenas tardes!')
    expect(text).not.toContain('${missing}')
  })
})
