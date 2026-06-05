import { describe, expect, it, vi, beforeEach } from 'vitest'
import { readSheet } from 'read-excel-file/browser'
import { parseCSVFile } from '../papaParser'
import { isSupportedPackageFile, parsePackageFile } from '../fileParser'

vi.mock('read-excel-file/browser', () => ({
  readSheet: vi.fn(),
}))

vi.mock('../papaParser', () => ({
  parseCSVFile: vi.fn(),
}))

describe('fileParser', () => {
  beforeEach(() => {
    vi.mocked(readSheet).mockReset()
    vi.mocked(parseCSVFile).mockReset()
  })

  it('valida extensiones soportadas', () => {
    expect(isSupportedPackageFile(new File([''], 'ruta.csv'))).toBe(true)
    expect(isSupportedPackageFile(new File([''], 'GENERICO.xlsx'))).toBe(true)
    expect(isSupportedPackageFile(new File([''], 'archivo.txt'))).toBe(false)
  })

  it('lee csv con PapaParse', async () => {
    const file = new File(['a,b'], 'ruta.csv', { type: 'text/csv' })
    vi.mocked(parseCSVFile).mockResolvedValue([['a', 'b']])

    await expect(parsePackageFile(file)).resolves.toEqual([['a', 'b']])
    expect(parseCSVFile).toHaveBeenCalledWith(file)
    expect(readSheet).not.toHaveBeenCalled()
  })

  it('lee xlsx y normaliza celdas a string', async () => {
    const file = new File([''], 'generico.xlsx')
    vi.mocked(readSheet).mockResolvedValue([
      ['CELULAR', 'CORREO'],
      [1133344455, null],
    ] as never)

    await expect(parsePackageFile(file)).resolves.toEqual([
      ['CELULAR', 'CORREO'],
      ['1133344455', ''],
    ])
    expect(readSheet).toHaveBeenCalledWith(file)
    expect(parseCSVFile).not.toHaveBeenCalled()
  })
})
