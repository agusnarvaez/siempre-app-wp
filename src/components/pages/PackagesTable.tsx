import { useContext, useEffect, useState } from 'react'
import { CSVContext, CSVRowData } from '../../context/CSVContext'
import { useLocation, useNavigate } from 'react-router-dom'

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
  Stack,
  Snackbar,
  Alert,
  TextField,
} from '@mui/material'
import { MessageCategory } from '../../data/templates'
import {
  getNextTemplate,
  interpolateTemplate,
  normalizePhone,
} from '../../services/messageTemplates'
import {
  getRemainingCooldownMs,
  registerMessageSent,
} from '../../services/messageCooldown'
import { isValidEstimatedVisit } from '../../utils/csvParser'

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
  const { csvData, setCSVData } = useContext(CSVContext)
  const navigate = useNavigate()
  const location = useLocation()
  const postSaleCooldownHours = 24
  const missingVisitCountFromForm = Number(location.state?.missingVisitCount || 0)

  // Para llevar control de qué filas han sido notificadas
  // Clave: índice de la fila, Valor: boolean
  const [notified, setNotified] = useState<Record<number, { aviso: boolean; posventa: boolean }>>({})
  const [blocked, setBlocked] = useState(false)
  const [remaining, setRemaining] = useState(0)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  })
  const [visitDraftByIndex, setVisitDraftByIndex] = useState<Record<number, string>>({})

  // efecto para disminuir el contador cada segundo
  useEffect(() => {
    if (!blocked || remaining <= 0) return
    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          setBlocked(false)
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [blocked, remaining])

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
    const [hh, mm] = visitaEstimada.split(':')
    const hours = parseInt(hh, 10)
    const mins = parseInt(mm, 10)
    if (isNaN(hours) || isNaN(mins)) return `${visitaEstimada} a ${visitaEstimada}`
    const endTotalMinutes = hours * 60 + mins + timeRange * 60
    const endHoursStr = Math.floor(endTotalMinutes / 60).toString().padStart(2, '0')
    const endMinutesStr = (endTotalMinutes % 60).toString().padStart(2, '0')
    return `${visitaEstimada} a ${endHoursStr}:${endMinutesStr}`
  }

  /**
   * Construye el link de WhatsApp con el mensaje personalizado.
   * @param row Fila de la tabla (CSVRowData).
   */
    // 🧠 Generador de link con plantilla aleatoria
  const buildWhatsappLink = (row: CSVRowData, category: MessageCategory): string => {
    const saludo = getGreeting()
    const timeRangeStr = buildTimeRangeString(row.VisitaEstimada, row.timeRange)
    const plantilla = getNextTemplate(category, row.Telefono)

    // 🧠 Reemplazamos manualmente las variables dentro del texto
    const message = interpolateTemplate(plantilla, {
      'row.Destinatario': row.Destinatario,
      'row.Cliente': row.Cliente,
      'row.Direccion': row.Direccion,
      timeRangeStr,
      saludo,
    })

    const telefono = normalizePhone(row.Telefono)
    return `https://wa.me/${telefono}?text=${encodeURIComponent(message)}`
  }

  /**
   * Manejador para marcar como "notificado" una fila.
   * Simplemente, guardamos en el estado local que esa fila fue notificada.
   * @param index Índice de la fila en la tabla
   */
  const handleNotify = (index: number, category: MessageCategory) => {
    // marcamos el tipo de notificacion correspondiente para esa fila.
    setNotified(prev => ({
      ...prev,
      [index]: {
        aviso: category === 'aviso' ? true : prev[index]?.aviso ?? false,
        posventa: category === 'posventa' ? true : prev[index]?.posventa ?? false,
      },
    }))

    // activar bloqueo global por 5s
    setBlocked(true)
    setRemaining(5)
  }

  const handleSendMessage = (row: CSVRowData, index: number, category: MessageCategory) => {
    if (blocked) return

    if (!isValidEstimatedVisit(row.VisitaEstimada)) {
      setSnackbar({
        open: true,
        message: 'Completa primero la visita estimada para poder enviar mensajes.',
      })
      return
    }

    const postSaleRecordKey = `${row.Codigo}:${index}`

    if (category === 'posventa') {
      const remainingMs = getRemainingCooldownMs('posventa', postSaleRecordKey, postSaleCooldownHours)
      if (remainingMs > 0) return
      registerMessageSent('posventa', postSaleRecordKey)
    }

    const link = buildWhatsappLink(row, category)
    window.open(link, '_blank', 'noopener,noreferrer')
    handleNotify(index, category)
    setSnackbar({
      open: true,
      message: category === 'aviso' ? 'Aviso listo para enviar en WhatsApp' : 'Posventa listo para enviar en WhatsApp',
    })
  }

  const getCooldownLabel = (row: CSVRowData, index: number): string | null => {
    const postSaleRecordKey = `${row.Codigo}:${index}`
    const remainingMs = getRemainingCooldownMs('posventa', postSaleRecordKey, postSaleCooldownHours)
    if (remainingMs <= 0) return null
    const hoursLeft = Math.ceil(remainingMs / (60 * 60 * 1000))
    return `Posventa en ${hoursLeft}h`
  }

  const saveVisitEstimated = (index: number) => {
    const draft = (visitDraftByIndex[index] || '').trim()
    if (!isValidEstimatedVisit(draft)) {
      setSnackbar({
        open: true,
        message: 'El horario debe tener formato HH:MM (24hs).',
      })
      return
    }

    const [h, m] = draft.split(':')
    const normalized = `${h.padStart(2, '0')}:${m}`

    setCSVData((prev) =>
      prev.map((row, i) => (i === index ? { ...row, VisitaEstimada: normalized } : row)),
    )

    setVisitDraftByIndex((prev) => {
      const next = { ...prev }
      delete next[index]
      return next
    })

    setSnackbar({
      open: true,
      message: `Horario guardado para ${normalized}.`,
    })
  }

  return (
    <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
      {missingVisitCountFromForm > 0 && (
        <Alert severity="warning" sx={{ m: 2 }}>
          Se cargaron {missingVisitCountFromForm} registros sin horario valido. Debes completar la visita estimada antes de enviar mensajes.
        </Alert>
      )}
      <Table>
        <TableHead sx={{
        backgroundColor: '#2b2b2b', // fondo más oscuro
        '& .MuiTableCell-root': {
          color: '#ffffff', // texto blanco
          fontWeight: 600,
          fontSize: '0.9rem',
          borderBottom: '2px solid #f15a24', // línea inferior naranja
        },
      }}>
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
            const status = notified[index] ?? { aviso: false, posventa: false }
            const cooldownLabel = getCooldownLabel(row, index)
            const isPostSaleBlocked = cooldownLabel !== null
            const hasValidVisit = isValidEstimatedVisit(row.VisitaEstimada)
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
                <TableCell>
                  {hasValidVisit ? row.VisitaEstimada : (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TextField
                        size="small"
                        placeholder="HH:MM"
                        value={visitDraftByIndex[index] ?? ''}
                        onChange={(e) =>
                          setVisitDraftByIndex((prev) => ({
                            ...prev,
                            [index]: e.target.value,
                          }))
                        }
                        inputProps={{ maxLength: 5 }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => saveVisitEstimated(index)}
                      >
                        Guardar
                      </Button>
                    </Stack>
                  )}
                </TableCell>
                <TableCell>{row.Estado}</TableCell>
                <TableCell>
                  <Stack direction="column" spacing={1}>
                    {status.aviso ? (
                      <Button color="secondary">Notificado</Button>
                    ) : (
                      <Button
                        variant="contained"
                        color={blocked ? 'secondary' : 'primary'}
                        onClick={() => handleSendMessage(row, index, 'aviso')}
                        disabled={blocked || !hasValidVisit}
                        aria-label={`Notificar paquete ${row.Codigo}`}
                      >
                        {!hasValidVisit ? 'Completar horario' : blocked ? `Esperando (${remaining}s)` : 'Notificar'}
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => handleSendMessage(row, index, 'posventa')}
                      disabled={blocked || isPostSaleBlocked || status.posventa || !hasValidVisit}
                      aria-label={`Enviar mensaje posventa de ${row.Codigo}`}
                    >
                      {status.posventa
                        ? 'Posventa enviado'
                        : !hasValidVisit
                          ? 'Completar horario'
                          : isPostSaleBlocked
                            ? cooldownLabel
                            : 'Mensaje posventa'}
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2200}
        onClose={() => setSnackbar({ open: false, message: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSnackbar({ open: false, message: '' })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </TableContainer>
  )
}
