import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import PackagesForm from '../PackagesForm'
import { CSVContext, CSVRowData } from '../../../context/CSVContext'
import { parseCSVFile } from '../../../utils/papaParser'
import { parseCSVRows } from '../../../utils/csvParser'

const mockSetCSVData = vi.fn<(value: CSVRowData[] | ((prev: CSVRowData[]) => CSVRowData[])) => void>()
const mockNavigate = vi.fn()

vi.mock('../../../utils/papaParser', () => ({
  parseCSVFile: vi.fn(),
}))

vi.mock('../../../utils/csvParser', () => ({
  parseCSVRows: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function renderForm() {
  return render(
    <CSVContext.Provider value={{ csvData: [], setCSVData: mockSetCSVData }}>
      <MemoryRouter>
        <PackagesForm />
      </MemoryRouter>
    </CSVContext.Provider>,
  )
}

function loadFile(file: File) {
  const input = document.getElementById('file-input') as HTMLInputElement
  fireEvent.change(input, { target: { files: [file] } })
}

function submitForm() {
  fireEvent.click(screen.getByRole('button', { name: /procesar csv y continuar/i }))
}

describe('PackagesForm', () => {
  beforeEach(() => {
    mockSetCSVData.mockReset()
    mockNavigate.mockReset()
    vi.mocked(parseCSVFile).mockReset()
    vi.mocked(parseCSVRows).mockReset()
  })

  it('arranca con boton avanzar deshabilitado', { timeout: 15000 }, () => {
    renderForm()

    const submitBtn = screen.getByRole('button', { name: /procesar csv y continuar/i })
    expect((submitBtn as HTMLButtonElement).disabled).toBe(true)
  })

  it('muestra error cuando se selecciona archivo no csv', async () => {
    renderForm()

    const badFile = new File(['contenido'], 'archivo.txt', { type: 'text/plain' })
    loadFile(badFile)

    const errorMessage = await screen.findByText(/Solo se permiten archivos con extensión .csv/i)
    expect(errorMessage).toBeTruthy()
  })

  it('habilita boton avanzar al cargar csv valido', async () => {
    renderForm()

    const csvFile = new File(['contenido'], 'archivo.csv', { type: 'text/csv' })
    loadFile(csvFile)

    const submitBtn = screen.getByRole('button', { name: /procesar csv y continuar/i })
    expect((submitBtn as HTMLButtonElement).disabled).toBe(false)
  })

  it('llama parser utilitario y navega cuando el submit es exitoso', async () => {
    vi.mocked(parseCSVFile).mockResolvedValue([
      ['Codigo', 'Cliente', 'Servicio', 'Destinatario', 'Telefono', 'Direccion', 'Referencia', 'Bultos', 'Visita estimada', 'Estado'],
      ['A1', 'Cliente Uno', 'Express', 'Juan', '1122334455', 'Calle 123', 'Porton', '1', '10:30', 'Pendiente'],
    ])

    vi.mocked(parseCSVRows).mockReturnValue({
      data: [
        {
          Codigo: 'A1',
          Cliente: 'Cliente Uno',
          Servicio: 'Express',
          Destinatario: 'Juan',
          Telefono: '1122334455',
          Direccion: 'Calle 123',
          Referencia: 'Porton',
          Bultos: '1',
          VisitaEstimada: '10:30',
          Estado: 'Pendiente',
          timeRange: 2,
        },
      ],
      missingVisitCount: 0,
    })

    renderForm()
    const csvFile = new File(['contenido'], 'archivo.csv', { type: 'text/csv' })
    loadFile(csvFile)

    submitForm()

    await waitFor(() => {
      expect(vi.mocked(parseCSVFile)).toHaveBeenCalledTimes(1)
      expect(mockSetCSVData).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith(
        '/tabla-de-paquetes',
        expect.objectContaining({ state: { missingVisitCount: 0 } }),
      )
    })
  })

  it('muestra error de parseo cuando parser utilitario falla', async () => {
    vi.mocked(parseCSVFile).mockRejectedValue(new Error('CSV invalido'))

    renderForm()
    const csvFile = new File(['contenido'], 'archivo.csv', { type: 'text/csv' })
    loadFile(csvFile)
    submitForm()

    const errorMessage = await screen.findByText(/Error parseando CSV: CSV invalido/i)
    expect(errorMessage).toBeTruthy()
  })

  it('muestra error cuando parser logico devuelve mensaje de validacion', async () => {
    vi.mocked(parseCSVFile).mockResolvedValue([])
    vi.mocked(parseCSVRows).mockReturnValue({
      error: 'Faltan columnas requeridas: visita estimada',
    })

    renderForm()
    const csvFile = new File(['contenido'], 'archivo.csv', { type: 'text/csv' })
    loadFile(csvFile)
    submitForm()

    const errorMessage = await screen.findByText(/Faltan columnas requeridas/i)
    expect(errorMessage).toBeTruthy()
    expect(mockSetCSVData).not.toHaveBeenCalled()
  })
})
