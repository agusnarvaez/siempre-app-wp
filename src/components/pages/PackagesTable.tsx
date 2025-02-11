import { useContext, useState } from 'react'
import { CSVContext, CSVRowData } from '../../context/CSVContext'
import { useNavigate } from 'react-router-dom'

// Material UI
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
} from '@mui/material'

/**
 * Retorna un saludo según la hora actual:
 *  - "Buenos días" si es antes de las 12
 *  - "Buenas tardes" si es antes de las 19
 *  - "Buenas noches" en caso contrario
 */
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function PackagesTable() {
  const { csvData } = useContext(CSVContext)
  const navigate = useNavigate()

  // Para llevar control de qué filas han sido notificadas
  // Clave: índice de la fila, Valor: boolean
  const [notified, setNotified] = useState<Record<number, boolean>>({})

  // Si NO hay datos, muestra el mensaje de error y botón para cargar paquetes
  if (!csvData || csvData.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2>No hay paquetes cargados</h2>
        <Button variant="contained" onClick={() => navigate('/')}>
          Cargar paquetes
        </Button>
      </div>
    )
  }

  function buildTimeRangeString(visitaEstimada: string, timeRange: number): string {
    const [hh, mm] = visitaEstimada.split(':');

    const hours = parseInt(hh, 10);
    const mins = parseInt(mm, 10);

    // Si no es un formato válido, retornamos la hora “tal cual”
    if (isNaN(hours) || isNaN(mins)) {
      return `${visitaEstimada} a ${visitaEstimada}`;
    }

    // Pasamos todo a minutos
    const startTotalMinutes = hours * 60 + mins;
    // Sumar timeRange horas en minutos
    const endTotalMinutes = startTotalMinutes + timeRange * 60;

    const endHours = Math.floor(endTotalMinutes / 60);
    const endMinutes = endTotalMinutes % 60;

    // Formateamos con cero a la izquierda si minutos < 10
    const endHoursStr = endHours.toString().padStart(2, '0');
    const endMinutesStr = endMinutes.toString().padStart(2, '0');

    return `${visitaEstimada} a ${endHoursStr}:${endMinutesStr}`;
  }

  /**
   * Construye el link de WhatsApp con el mensaje personalizado.
   * @param row Fila de la tabla (CSVRowData).
   */
  const buildWhatsappLink = (row: CSVRowData): string => {
    // Ej. row.VisitaEstimada = "10", row.timeRange = 2 => "12"
    const timeRangeStr = buildTimeRangeString(row.VisitaEstimada, row.timeRange)
    const saludo = getGreeting()

    // Mensaje según el enunciado
    const message = `${saludo} ${row.Destinatario} como estas? Te escribimos de Siempre Logistica por tu envio de ${
      row.Cliente
    }. Llegaremos mañana a ${row.Direccion} entre las ${timeRangeStr}.
Que termines muy bien tu dia!`

    // Teléfono sin el "+"
    const telefono = row.Telefono.replace(/\+/g, '')

    // Codifica el texto en formato URL
    return `https://wa.me/${telefono}?text=${encodeURIComponent(message)}`
  }

  /**
   * Manejador para marcar como "notificado" una fila.
   * Simplemente, guardamos en el estado local que esa fila fue notificada.
   * @param index Índice de la fila en la tabla
   */
  const handleNotify = (index: number) => {
    setNotified((prev) => ({
      ...prev,
      [index]: true,
    }))
  }

  return (
    <TableContainer component={Paper} >
      <Table>
        <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Servicio</TableCell>
            <TableCell>Destinatario</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell>Referencia</TableCell>
            <TableCell>Bultos</TableCell>
            <TableCell>Visita Estimada</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {csvData.map((row, index) => {
            const isNotified = !!notified[index]

            return (
              <TableRow key={index}>
                <TableCell>{row.Codigo}</TableCell>
                <TableCell>{row.Cliente}</TableCell>
                <TableCell>{row.Servicio}</TableCell>
                <TableCell>{row.Destinatario}</TableCell>
                <TableCell>{row.Telefono}</TableCell>
                <TableCell>{row.Direccion}</TableCell>
                <TableCell>{row.Referencia}</TableCell>
                <TableCell>{row.Bultos}</TableCell>
                <TableCell>{row.VisitaEstimada}</TableCell>
                <TableCell>{row.Estado}</TableCell>
                <TableCell>
                  {isNotified ? (
                    <Button color="secondary" >
                      Notificado
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleNotify(index)}
                      // Al hacer clic, abrimos el link de WhatsApp en otra pestaña
                      component="a"
                      href={buildWhatsappLink(row)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Notificar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
