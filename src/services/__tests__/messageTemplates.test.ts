import { describe, expect, it, beforeEach } from 'vitest'
import { messageTemplates } from '../../data/templates'
import { getNextTemplate, interpolateTemplate, normalizePhone } from '../messageTemplates'

describe('messageTemplates', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('normaliza telefono removiendo caracteres no numericos', () => {
    expect(normalizePhone('+54 9 11-2233-4455')).toBe('5491122334455')
  })

  it('distribuye templates entre telefonos distintos', () => {
    const first = getNextTemplate('posventa', '11-1234-5678')
    const second = getNextTemplate('posventa', '11-8765-4321')

    expect(first.length).toBeGreaterThan(0)
    expect(second.length).toBeGreaterThan(0)
    expect(second).not.toBe(first)
  })

  it('no repite templates hasta agotar las variantes de una categoria', () => {
    const generated = messageTemplates.posventa.map((_, index) =>
      getNextTemplate('posventa', `11-0000-${index.toString().padStart(4, '0')}`),
    )

    expect(new Set(generated).size).toBe(messageTemplates.posventa.length)
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
