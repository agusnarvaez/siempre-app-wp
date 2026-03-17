import { CSVRowData } from '../context/CSVContext'

const REQUIRED_COLUMNS = [
  'codigo',
  'cliente',
  'servicio',
  'destinatario',
  'telefono',
  'direccion',
  'referencia',
  'bultos',
  'visita estimada',
  'estado',
]

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase()
}

export function isValidEstimatedVisit(value: string): boolean {
  return /^([01]?\d|2[0-3]):[0-5]\d$/.test(value.trim())
}

function findHeaderIndex(allRows: string[][]): number {
  return allRows.findIndex((row) => row.includes('Codigo') && row.includes('Cliente'))
}

function getHeaders(headerRow: string[]): string[] {
  return headerRow.map(normalizeHeader)
}

function getColumnIndex(headers: string[], name: string): number {
  return headers.indexOf(name.toLowerCase())
}

function getMissingColumns(headers: string[]): string[] {
  return REQUIRED_COLUMNS.filter((col) => getColumnIndex(headers, col) === -1)
}

export function parseCSVRows(allRows: string[][], timeRange: number):
  | { data: CSVRowData[]; missingVisitCount: number; error?: never }
  | { data?: never; error: string } {
  const headerIndex = findHeaderIndex(allRows)

  if (headerIndex === -1) {
    return { error: 'No se encontró la fila de encabezado (Codigo, Cliente...)' }
  }

  const headerRow = allRows[headerIndex]
  const dataRows = allRows.slice(headerIndex + 1)
  const headers = getHeaders(headerRow)

  const missing = getMissingColumns(headers)
  if (missing.length > 0) {
    return { error: `Faltan columnas requeridas: ${missing.join(', ')}` }
  }

  const visitaEstimadaIndex = getColumnIndex(headers, 'visita estimada')
  let missingVisitCount = 0

  const parsedData: CSVRowData[] = dataRows.map((row) => {
    const rawVisit = (row[visitaEstimadaIndex] || '').trim()
    const hasValidVisit = isValidEstimatedVisit(rawVisit)
    if (!hasValidVisit) missingVisitCount += 1

    return {
    Codigo: row[getColumnIndex(headers, 'codigo')] || '',
    Cliente: row[getColumnIndex(headers, 'cliente')] || '',
    Servicio: row[getColumnIndex(headers, 'servicio')] || '',
    Destinatario: row[getColumnIndex(headers, 'destinatario')] || '',
    Telefono: row[getColumnIndex(headers, 'telefono')] || '',
    Direccion: row[getColumnIndex(headers, 'direccion')] || '',
    Referencia: row[getColumnIndex(headers, 'referencia')] || '',
    Bultos: row[getColumnIndex(headers, 'bultos')] || '',
    VisitaEstimada: hasValidVisit ? rawVisit : '',
    Estado: row[getColumnIndex(headers, 'estado')] || '',
    timeRange,
    }
  })

  return { data: parsedData, missingVisitCount }
}
