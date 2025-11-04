
import { useContext, useRef } from 'react'
import Papa from 'papaparse'
import { useForm, SubmitHandler } from 'react-hook-form'
import { CSVContext, CSVRowData } from '../../context/CSVContext'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
// importar botón de material
import Button from '@mui/material/Button'
import { TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'


// Definimos el tipo de datos para el form
type FormData = {
  file: FileList // El input de tipo "file" nos devuelve un FileList
  timeRange: number
}

export default function PackagesForm(){
  const { setCSVData } = useContext(CSVContext)
  const navigate = useNavigate()
  const hiddenFileInput = useRef<HTMLInputElement | null>(null) // Referencia al input de tipo "file"

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<FormData>()

  // Extraemos las props del registro de "file"
  const fileRegister = register('file', {
    required: 'El archivo CSV es obligatorio',
  })

  // "Escuchamos" qué archivo está seleccionado (si hay alguno)
  const watchedFile = watch('file') // Devuelve un FileList o undefined

  // Manejo de submit del formulario
  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (!data.file || data.file.length === 0) return
    const file = data.file[0]

    Papa.parse(file, {
      skipEmptyLines: true,
      delimitersToGuess: [',', ';'], // Detecta automáticamente el delimitador
      complete: (results) => {
        const allRows = results.data as string[][]

        // Buscar la fila que contiene los encabezados válidos
        const headerIndex = allRows.findIndex(
          (row) => row.includes('Codigo') && row.includes('Cliente')
        )

        if (headerIndex === -1) {
          setError('file', {
            type: 'manual',
            message: 'No se encontró la fila de encabezado (Codigo, Cliente...)',
          })
          return
        }

        // Extraer encabezado y filas de datos
        const headerRow = allRows[headerIndex]
        const dataRows = allRows.slice(headerIndex + 1)

        // Normalizar los encabezados (sin espacios, todo en minúscula)
        const headers = headerRow.map((h) => h.trim().toLowerCase())

        // Crear una función para obtener el índice por nombre de columna
        const getIndex = (name: string) => headers.indexOf(name.toLowerCase())

        // Validar que estén todas las columnas requeridas
        const requiredCols = [
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

        const missing = requiredCols.filter((col) => getIndex(col) === -1)
        if (missing.length > 0) {
          setError('file', {
            type: 'manual',
            message: `Faltan columnas requeridas: ${missing.join(', ')}`,
          })
          return
        }

        // Mapear filas a objetos CSVRowData
        const parsedData: CSVRowData[] = dataRows.map((row) => ({
          Codigo: row[getIndex('codigo')] || '',
          Cliente: row[getIndex('cliente')] || '',
          Servicio: row[getIndex('servicio')] || '',
          Destinatario: row[getIndex('destinatario')] || '',
          Telefono: row[getIndex('telefono')] || '',
          Direccion: row[getIndex('direccion')] || '',
          Referencia: row[getIndex('referencia')] || '',
          Bultos: row[getIndex('bultos')] || '',
          VisitaEstimada: row[getIndex('visita estimada')] || '',
          Estado: row[getIndex('estado')] || '',
          timeRange: data.timeRange,
        }))

        setCSVData(parsedData)
        console.log(parsedData)
        navigate('/tabla-de-paquetes')
      },
      error: (err) => {
        console.error('Error parseando CSV:', err)
      },
    })

  }

  /**
   * Abrir el diálogo de selección de archivo (simulando el click en <input type="file">)
   */
  const handleClickOpenFile = () => {
    hiddenFileInput.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      // Si por alguna razón no hay archivo (cierre de diálogo sin seleccionar),
      // limpiamos el error anterior (si lo hubiera) y salimos
      clearErrors('file')
      return
    }

    // Validar extensión .csv (en minúsculas para evitar problemas con mayúsculas)
    if (!file.name.toLowerCase().endsWith('.csv')) {
      // Marcamos error en RHF
      setError('file', {
        type: 'manual',
        message: 'Solo se permiten archivos con extensión .csv',
      })
      // Limpiamos el input
      e.target.value = ''
      return
    }

    // Si es .csv, limpia cualquier error previo y llama al onChange original de RHF
    clearErrors('file')
    fileRegister.onChange(e)  // <---- importante
  }

  const isFileLoaded = watchedFile?.length === 1

  return (
    <form className='packages-form' onSubmit={handleSubmit(onSubmit)}>

      {/* Input para seleccionar rango horario */}
      <TextField
        label="Rango horario (en horas)"
        type="number"
        variant="outlined"
        defaultValue={2} // Valor inicial por defecto
        sx={{ marginBottom: 2 }}
        inputProps={{
          min: 2, // Valor mínimo
        }}
        error={!!errors.timeRange}
        helperText={errors.timeRange?.message}
        // Registramos con RHF (conviértelo a número con valueAsNumber)
        {...register('timeRange', {
          required: 'El rango horario es obligatorio',
          valueAsNumber: true,
          min: {
            value: 2,
            message: 'El rango debe ser al menos 1',
          },
        })}
      />

      {/* Input oculto */}
      <input
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        // Combinamos ambas refs
        ref={(node) => {
          fileRegister.ref(node) // Asignamos la ref de react-hook-form
          hiddenFileInput.current = node // Guardamos también la referencia en hiddenFileInput
        }}
        name={fileRegister.name}
        onBlur={fileRegister.onBlur}
        onChange={handleFileChange}
      />
      {/* Si hay un archivo seleccionado (por click o drop), muestra su nombre */}
      {isFileLoaded && (
        <p>
          <b>Archivo seleccionado:</b> {watchedFile?.[0]?.name}
        </p>
      )}

      {/* Mensaje de error si no sube archivo */}
      {errors.file && (
        <p style={{ color: 'red' }}>{errors.file.message}</p>
      )}

      {/* Botón para procesar el archivo CSV */}
      <Button
        variant="contained"
        type="button"
        onClick={handleClickOpenFile}
      >
        <UploadFileIcon /> Cargar archivo CSV
      </Button>

      {/* Botón para "avanzar": se hace submit normal,
          pero podrías cambiar la lógica según necesites */}
      <Button disabled={!isFileLoaded} type="submit">Avanzar <NavigateNextIcon /></Button>
    </form>
  )
}