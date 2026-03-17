import { describe, expect, it } from 'vitest'
import { isValidEstimatedVisit, parseCSVRows } from '../csvParser'

describe('csvParser', () => {
  it('valida formato HH:MM correctamente', () => {
    expect(isValidEstimatedVisit('00:00')).toBe(true)
    expect(isValidEstimatedVisit('23:59')).toBe(true)
    expect(isValidEstimatedVisit('24:00')).toBe(false)
    expect(isValidEstimatedVisit('10:7')).toBe(false)
  })

  it('retorna error cuando no encuentra encabezados', () => {
    const result = parseCSVRows([
      ['foo', 'bar'],
      ['1', '2'],
    ], 2)

    expect(result).toEqual({
      error: 'No se encontró la fila de encabezado (Codigo, Cliente...)',
    })
  })

  it('retorna error cuando faltan columnas requeridas', () => {
    const result = parseCSVRows([
      ['Codigo', 'Cliente', 'Servicio', 'Destinatario', 'Telefono', 'Direccion', 'Referencia', 'Bultos', 'Estado'],
      ['A1', 'Cliente Uno', 'Express', 'Juan', '1122334455', 'Calle 123', 'Porton', '1', 'Pendiente'],
    ], 2)

    expect('error' in result).toBe(true)
    if ('error' in result) {
      expect(result.error).toContain('Faltan columnas requeridas')
      expect(result.error).toContain('visita estimada')
    }
  })

  it('no falla el parseo cuando visita estimada es invalida y la deja vacia', () => {
    const result = parseCSVRows([
      ['Codigo', 'Cliente', 'Servicio', 'Destinatario', 'Telefono', 'Direccion', 'Referencia', 'Bultos', 'Visita estimada', 'Estado'],
      ['A2', 'Cliente Dos', 'Express', 'Ana', '1199988877', 'Calle 456', 'Depto', '2', '27:99', 'Pendiente'],
    ], 3)

    expect('error' in result).toBe(false)
    if (!('error' in result)) {
      expect(result.missingVisitCount).toBe(1)
      expect(result.data[0].VisitaEstimada).toBe('')
    }
  })

  it('parsea filas validas a CSVRowData', () => {
    const result = parseCSVRows([
      ['Codigo', 'Cliente', 'Servicio', 'Destinatario', 'Telefono', 'Direccion', 'Referencia', 'Bultos', 'Visita estimada', 'Estado'],
      ['A3', 'Cliente Tres', 'Express', 'Pedro', '1166677788', 'Calle 789', 'Casa', '1', '09:30', 'Pendiente'],
    ], 4)

    expect('data' in result).toBe(true)
    if (!('error' in result)) {
      expect(result.data).toHaveLength(1)
      expect(result.data[0]).toMatchObject({
        Codigo: 'A3',
        Cliente: 'Cliente Tres',
        Destinatario: 'Pedro',
        VisitaEstimada: '09:30',
        timeRange: 4,
      })
    }
  })

  it('acepta valores con espacios en visita estimada y los normaliza para validar', () => {
    const result = parseCSVRows([
      ['Codigo', 'Cliente', 'Servicio', 'Destinatario', 'Telefono', 'Direccion', 'Referencia', 'Bultos', 'Visita estimada', 'Estado'],
      ['A4', 'Cliente Cuatro', 'Express', 'Luz', '1100001111', 'Calle 999', 'Local', '3', ' 08:05 ', 'Pendiente'],
    ], 2)

    expect('error' in result).toBe(false)
  })

  it('completa campos faltantes con string vacio en filas cortas', () => {
    const result = parseCSVRows([
      ['Codigo', 'Cliente', 'Servicio', 'Destinatario', 'Telefono', 'Direccion', 'Referencia', 'Bultos', 'Visita estimada', 'Estado'],
      ['A5', 'Cliente Cinco', 'Express', 'Leo', '1177778888', 'Calle 222', 'Timbre', '1', '09:15'],
    ], 2)

    if (!('error' in result)) {
      expect(result.data[0].Estado).toBe('')
    }
  })

  it('mantiene parseo exitoso cuando hay campos vacios pero visita estimada valida', () => {
    const result = parseCSVRows([
      ['Codigo', 'Cliente', 'Servicio', 'Destinatario', 'Telefono', 'Direccion', 'Referencia', 'Bultos', 'Visita estimada', 'Estado'],
      ['A6', '', '', '', '', '', '', '', '11:11', ''],
    ], 1)

    if (!('error' in result)) {
      expect(result.data[0]).toMatchObject({
        Codigo: 'A6',
        Cliente: '',
        Servicio: '',
        Destinatario: '',
        Telefono: '',
        Direccion: '',
        Referencia: '',
        Bultos: '',
        VisitaEstimada: '11:11',
        Estado: '',
      })
    }
  })
})
