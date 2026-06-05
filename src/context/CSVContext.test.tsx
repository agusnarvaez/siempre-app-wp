import { useContext } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CSVContext, CSVProvider } from './CSVContext'

function ConsumerProbe() {
  const { csvData, setCSVData } = useContext(CSVContext)

  return (
    <div>
      <span>rows:{csvData.length}</span>
      <button
        type="button"
        onClick={() =>
          setCSVData([
            {
              Codigo: 'A1',
              Cliente: 'Cliente',
              Servicio: 'Express',
              Destinatario: 'Juan',
              Telefono: '1122334455',
              Direccion: 'Calle 123',
              Referencia: 'Puerta',
              Bultos: '1',
              VisitaEstimada: '10:30',
              RangoHorario: '',
              Estado: 'Pendiente',
              timeRange: 2,
            },
          ])
        }
      >
        set-data
      </button>
    </div>
  )
}

describe('CSVContext', () => {
  it('provee estado y permite actualizar csvData', () => {
    render(
      <CSVProvider>
        <ConsumerProbe />
      </CSVProvider>,
    )

    expect(screen.getByText('rows:0')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /set-data/i }))
    expect(screen.getByText('rows:1')).toBeTruthy()
  })
})
