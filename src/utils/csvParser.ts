import { CSVRowData } from '../context/CSVContext'

const ROUTE_REQUIRED_COLUMNS = [
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

const GENERIC_REQUIRED_COLUMNS = [
  'celular',
  'correo',
  'calle',
  'altura',
  'localidad',
  'provincia',
]

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase()
}

export function isValidEstimatedVisit(value: string): boolean {
  return /^([01]?\d|2[0-3]):[0-5]\d$/.test(value.trim())
}

function normalizeCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

function isBlankRow(row: string[]): boolean {
  return row.every((cell) => normalizeCell(cell) === '')
}

function getHeaders(headerRow: string[]): string[] {
  return headerRow.map(normalizeHeader)
}

function getColumnIndex(headers: string[], name: string): number {
  return headers.indexOf(name.toLowerCase())
}

function findRouteHeaderIndex(allRows: string[][]): number {
  return allRows.findIndex((row) => row.includes('Codigo') && row.includes('Cliente'))
}

function findGenericHeaderIndex(allRows: string[][]): number {
  return allRows.findIndex((row) => {
    const headers = getHeaders(row)
    return (
      getColumnIndex(headers, 'celular') !== -1 &&
      getColumnIndex(headers, 'correo') !== -1 &&
      getColumnIndex(headers, 'calle') !== -1
    )
  })
}

function getMissingColumns(headers: string[], requiredColumns: string[]): string[] {
  return requiredColumns.filter((col) => getColumnIndex(headers, col) === -1)
}

function getValue(row: string[], index: number): string {
  if (index < 0) return ''
  return normalizeCell(row[index])
}

function joinAddress(parts: string[]): string {
  return parts.map(normalizeCell).filter(Boolean).join(', ')
}

export function parseCSVRows(allRows: string[][], timeRange: number):
  | { data: CSVRowData[]; missingVisitCount: number; error?: never }
  | { data?: never; error: string } {
  const routeHeaderIndex = findRouteHeaderIndex(allRows)
  if (routeHeaderIndex !== -1) {
    return parseRouteRows(allRows, routeHeaderIndex, timeRange)
  }

  const genericHeaderIndex = findGenericHeaderIndex(allRows)
  if (genericHeaderIndex !== -1) {
    return parseGenericRows(allRows, genericHeaderIndex, timeRange)
  }

  return { error: 'No se encontro una fila de encabezado valida' }
}

function parseRouteRows(allRows: string[][], headerIndex: number, timeRange: number):
  | { data: CSVRowData[]; missingVisitCount: number; error?: never }
  | { data?: never; error: string } {
  const headerRow = allRows[headerIndex]
  const dataRows = allRows.slice(headerIndex + 1).filter((row) => !isBlankRow(row))
  const headers = getHeaders(headerRow)

  const missing = getMissingColumns(headers, ROUTE_REQUIRED_COLUMNS)
  if (missing.length > 0) {
    return { error: `Faltan columnas requeridas: ${missing.join(', ')}` }
  }

  const visitaEstimadaIndex = getColumnIndex(headers, 'visita estimada')
  let missingVisitCount = 0

  const parsedData: CSVRowData[] = dataRows.map((row) => {
    const rawVisit = getValue(row, visitaEstimadaIndex)
    const hasValidVisit = isValidEstimatedVisit(rawVisit)
    if (!hasValidVisit) missingVisitCount += 1

    return {
      Codigo: getValue(row, getColumnIndex(headers, 'codigo')),
      Cliente: getValue(row, getColumnIndex(headers, 'cliente')),
      Servicio: getValue(row, getColumnIndex(headers, 'servicio')),
      Destinatario: getValue(row, getColumnIndex(headers, 'destinatario')),
      Telefono: getValue(row, getColumnIndex(headers, 'telefono')),
      Direccion: getValue(row, getColumnIndex(headers, 'direccion')),
      Referencia: getValue(row, getColumnIndex(headers, 'referencia')),
      Bultos: getValue(row, getColumnIndex(headers, 'bultos')),
      VisitaEstimada: hasValidVisit ? rawVisit : '',
      RangoHorario: '',
      Estado: getValue(row, getColumnIndex(headers, 'estado')),
      timeRange,
    }
  })

  return { data: parsedData, missingVisitCount }
}

function parseGenericRows(allRows: string[][], headerIndex: number, timeRange: number):
  | { data: CSVRowData[]; missingVisitCount: number; error?: never }
  | { data?: never; error: string } {
  const headerRow = allRows[headerIndex]
  const dataRows = allRows.slice(headerIndex + 1).filter((row) => !isBlankRow(row))
  const headers = getHeaders(headerRow)

  const missing = getMissingColumns(headers, GENERIC_REQUIRED_COLUMNS)
  if (missing.length > 0) {
    return { error: `Faltan columnas requeridas: ${missing.join(', ')}` }
  }

  const celularIndex = getColumnIndex(headers, 'celular')
  const correoIndex = getColumnIndex(headers, 'correo')
  const calleIndex = getColumnIndex(headers, 'calle')
  const alturaIndex = getColumnIndex(headers, 'altura')
  const localidadIndex = getColumnIndex(headers, 'localidad')
  const partidoIndex = getColumnIndex(headers, 'partido')
  const provinciaIndex = getColumnIndex(headers, 'provincia')
  const pisoDeptoIndex = getColumnIndex(headers, 'piso/depto')
  const observacionesIndex = getColumnIndex(headers, 'observaciones')
  const clienteNameIndex = celularIndex > 0 && !headers[celularIndex - 1] ? celularIndex - 1 : -1

  let missingVisitCount = 0

  const parsedData: CSVRowData[] = dataRows.map((row, index) => {
    const rangoHorario = getValue(row, correoIndex)
    if (!rangoHorario) missingVisitCount += 1

    const calle = getValue(row, calleIndex)
    const altura = getValue(row, alturaIndex)
    const pisoDepto = getValue(row, pisoDeptoIndex)
    const localidad = getValue(row, localidadIndex)
    const partido = getValue(row, partidoIndex)
    const provincia = getValue(row, provinciaIndex)

    const clienteName = getValue(row, clienteNameIndex)

    return {
      Codigo: `GEN-${index + 1}`,
      Cliente: clienteName,
      Servicio: '',
      Destinatario: clienteName,
      Telefono: getValue(row, celularIndex),
      Direccion: joinAddress([joinAddress([calle, altura]), pisoDepto, localidad, partido, provincia]),
      Referencia: getValue(row, observacionesIndex),
      Bultos: '',
      VisitaEstimada: '',
      RangoHorario: rangoHorario,
      Estado: '',
      timeRange,
    }
  })

  return { data: parsedData, missingVisitCount }
}
