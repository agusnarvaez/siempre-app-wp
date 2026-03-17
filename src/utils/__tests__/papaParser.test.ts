import { describe, expect, it, vi, beforeEach } from 'vitest'
import Papa from 'papaparse'
import { parseCSVFile } from '../papaParser'

vi.mock('papaparse', () => ({
  default: {
    parse: vi.fn(),
  },
}))

describe('papaParser', () => {
  beforeEach(() => {
    vi.mocked(Papa.parse as any).mockReset()
  })

  it('resuelve filas cuando parse completa correctamente', async () => {
    vi.mocked(Papa.parse as any).mockImplementation((_file: any, config: any) => {
      config.complete({ data: [['A', 'B']] })
    })

    const rows = await parseCSVFile(new File(['x'], 'ok.csv', { type: 'text/csv' }))
    expect(rows).toEqual([['A', 'B']])
  })

  it('rechaza con mensaje cuando parse falla', async () => {
    vi.mocked(Papa.parse as any).mockImplementation((_file: any, config: any) => {
      config.error({ message: 'fallo csv' })
    })

    await expect(parseCSVFile(new File(['x'], 'bad.csv', { type: 'text/csv' }))).rejects.toThrow('fallo csv')
  })
})
