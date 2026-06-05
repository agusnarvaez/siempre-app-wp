import { parseCSVFile } from './papaParser'

type CellValue = string | number | boolean | Date | null

function normalizeSpreadsheetRows(rows: CellValue[][]): string[][] {
  return rows.map((row) => row.map((cell) => (cell === null || cell === undefined ? '' : String(cell))))
}

export function isSupportedPackageFile(file: File): boolean {
  const fileName = file.name.toLowerCase()
  return fileName.endsWith('.csv') || fileName.endsWith('.xlsx')
}

export async function parsePackageFile(file: File): Promise<string[][]> {
  const fileName = file.name.toLowerCase()

  if (fileName.endsWith('.xlsx')) {
    const { readSheet } = await import('read-excel-file/browser')
    const rows = await readSheet(file)
    return normalizeSpreadsheetRows(rows as CellValue[][])
  }

  return parseCSVFile(file)
}
