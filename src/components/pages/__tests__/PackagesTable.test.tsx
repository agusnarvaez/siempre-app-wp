import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { useState } from 'react'
import PackagesTable from '../PackagesTable'
import { CSVContext, CSVRowData } from '../../../context/CSVContext'
import { registerMessageSent } from '../../../services/messageCooldown'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const baseRow: CSVRowData = {
  Codigo: 'PKG-1',
  Cliente: 'Cliente Demo',
  Servicio: 'Express',
  Destinatario: 'Juan Perez',
  Telefono: '11-2233-4455',
  Direccion: 'Calle Falsa 123',
  Referencia: 'Porton gris',
  Bultos: '1',
  VisitaEstimada: '10:00',
  Estado: 'Pendiente',
  timeRange: 2,
}

const secondRow: CSVRowData = {
  ...baseRow,
  Codigo: 'PKG-2',
  Destinatario: 'Ana Perez',
  Telefono: '11-9999-0000',
}

function renderTable(rows: CSVRowData[], missingVisitCount = 0) {
  function TestProvider({ initialRows, missingCount }: { initialRows: CSVRowData[]; missingCount: number }) {
    const [csvData, setCSVData] = useState(initialRows)
    return (
      <CSVContext.Provider value={{ csvData, setCSVData }}>
        <MemoryRouter
          initialEntries={[{ pathname: '/paquetes', state: { missingVisitCount: missingCount } }]}
        >
          <PackagesTable />
        </MemoryRouter>
      </CSVContext.Provider>
    )
  }

  return render(
    <TestProvider initialRows={rows} missingCount={missingVisitCount} />,
  )
}

describe('PackagesTable', () => {
  beforeEach(() => {
    localStorage.clear()
    mockNavigate.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('muestra pantalla vacia cuando no hay paquetes', () => {
    renderTable([])

    expect(screen.getByText(/No hay paquetes cargados/i)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /cargar paquetes/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('envia aviso y marca la fila como notificada', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    renderTable([baseRow])

    fireEvent.click(screen.getByRole('button', { name: /notificar paquete pkg-1/i }))

    expect(openSpy).toHaveBeenCalledTimes(1)
    expect(screen.getByText(/Notificado/i)).toBeTruthy()
    expect(screen.getByText(/Aviso listo para enviar en WhatsApp/i)).toBeTruthy()
  })

  it('aplica bloqueo global de 5 segundos y luego libera el envio', () => {
    vi.useFakeTimers()
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    renderTable([baseRow, secondRow])

    fireEvent.click(screen.getByRole('button', { name: /notificar paquete pkg-1/i }))

    const secondNotifyButton = screen.getByRole('button', { name: /notificar paquete pkg-2/i }) as HTMLButtonElement
    expect(secondNotifyButton.disabled).toBe(true)
    expect(screen.getByText(/Esperando \(5s\)/i)).toBeTruthy()

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    const unlockedNotifyButton = screen.getByRole('button', { name: /notificar paquete pkg-2/i }) as HTMLButtonElement
    expect(unlockedNotifyButton.disabled).toBe(false)

    fireEvent.click(unlockedNotifyButton)
    expect(openSpy).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })

  it('bloquea envio cuando falta horario y pide completarlo', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    const invalidHourRow: CSVRowData = {
      ...baseRow,
      Codigo: 'PKG-3',
      VisitaEstimada: 'xx:yy',
    }

    renderTable([invalidHourRow])
    const notifyBtn = screen.getByRole('button', { name: /notificar paquete pkg-3/i }) as HTMLButtonElement

    expect(notifyBtn.disabled).toBe(true)
    expect(screen.getAllByText(/Completar horario/i).length).toBeGreaterThan(0)
    expect(openSpy).toHaveBeenCalledTimes(0)
  })

  it('permite guardar horario faltante y luego enviar', () => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(9)
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    const invalidHourRow: CSVRowData = {
      ...baseRow,
      Codigo: 'PKG-5',
      VisitaEstimada: '',
    }

    renderTable([invalidHourRow])

    const input = screen.getByPlaceholderText('HH:MM') as HTMLInputElement
    fireEvent.change(input, { target: { value: '0:20' } })
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }))
    fireEvent.click(screen.getByRole('button', { name: /notificar paquete pkg-5/i }))

    expect(openSpy).toHaveBeenCalledTimes(1)
    expect((openSpy.mock.calls[0][0] as string)).toContain('00%3A20')
  })

  it('genera saludo nocturno en la URL de WhatsApp', () => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(21)
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    renderTable([{ ...baseRow, Codigo: 'PKG-4' }])
    fireEvent.click(screen.getByRole('button', { name: /notificar paquete pkg-4/i }))

    const firstCall = openSpy.mock.calls[0]
    expect((firstCall[0] as string)).toContain('Buenas%20noches')
  })

  it('bloquea posventa solo para el registro en cooldown', () => {
    registerMessageSent('posventa', 'PKG-1:0')
    renderTable([baseRow])

    const posventaBtn = screen.getByRole('button', { name: /enviar mensaje posventa de pkg-1/i })
    expect((posventaBtn as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByText(/Posventa en/i)).toBeTruthy()
  })

  it('envia posventa cuando no hay cooldown y cambia estado del boton', () => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(10)
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    renderTable([baseRow])

    fireEvent.click(screen.getByRole('button', { name: /enviar mensaje posventa de pkg-1/i }))

    expect(openSpy).toHaveBeenCalledTimes(1)
    expect(screen.getByText(/Posventa enviado/i)).toBeTruthy()
    expect(screen.getByText(/Posventa listo para enviar en WhatsApp/i)).toBeTruthy()
  })

  it('muestra error si se intenta guardar un horario invalido', () => {
    const invalidHourRow: CSVRowData = {
      ...baseRow,
      Codigo: 'PKG-6',
      VisitaEstimada: '',
    }

    renderTable([invalidHourRow])
    const input = screen.getByPlaceholderText('HH:MM') as HTMLInputElement
    fireEvent.change(input, { target: { value: '25:90' } })
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }))

    expect(screen.getByText(/El horario debe tener formato HH:MM \(24hs\)/i)).toBeTruthy()
  })

  it('muestra alerta superior cuando el formulario reporta registros sin horario', () => {
    renderTable([baseRow], 2)

    expect(screen.getByText(/Se cargaron 2 registros sin horario valido/i)).toBeTruthy()
  })
})
