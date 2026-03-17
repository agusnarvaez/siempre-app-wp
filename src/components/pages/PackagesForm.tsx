
import { useContext, useRef, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { CSVContext } from '../../context/CSVContext'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
// importar botón de material
import Button from '@mui/material/Button'
import { Alert, CircularProgress, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { parseCSVRows } from '../../utils/csvParser'
import { parseCSVFile } from '../../utils/papaParser'


// Definimos el tipo de datos para el form
type FormData = {
  file: FileList // El input de tipo "file" nos devuelve un FileList
  timeRange: number
}

export default function PackagesForm(){
  const { setCSVData } = useContext(CSVContext)
  const navigate = useNavigate()
  const hiddenFileInput = useRef<HTMLInputElement | null>(null) // Referencia al input de tipo "file"
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<FormData>()

  // Extraemos las props del registro de "file"
  const fileRegister = register('file')

  // "Escuchamos" qué archivo está seleccionado (si hay alguno)
  const watchedFile = watch('file') // Devuelve un FileList o undefined

  // Manejo de submit del formulario
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!data.file || data.file.length === 0) {
      setError('file', {
        type: 'manual',
        message: 'El archivo CSV es obligatorio',
      })
      return
    }
    const file = data.file[0]
    setIsProcessing(true)

    try {
      const allRows = await parseCSVFile(file)
      const parsedResult = parseCSVRows(allRows, data.timeRange)

      if ('error' in parsedResult) {
        setError('file', {
          type: 'manual',
          message: parsedResult.error,
        })
        return
      }

      setCSVData(parsedResult.data)
      navigate('/tabla-de-paquetes', {
        state: {
          missingVisitCount: parsedResult.missingVisitCount,
        },
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError('file', {
        type: 'manual',
        message: `Error parseando CSV: ${message}`,
      })
    } finally {
      setIsProcessing(false)
    }
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
        id="file-input"
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
        <Alert severity="error">{errors.file.message}</Alert>
      )}

      {/* Botón para procesar el archivo CSV */}
      <Button
        variant="contained"
        type="button"
        onClick={handleClickOpenFile}
        aria-label="Cargar archivo CSV"
      >
        <UploadFileIcon /> Cargar archivo CSV
      </Button>

      {/* Botón para "avanzar": se hace submit normal,
          pero podrías cambiar la lógica según necesites */}
      <Button disabled={!isFileLoaded || isProcessing} type="submit" aria-label="Procesar CSV y continuar">
        {isProcessing ? <CircularProgress size={20} color="inherit" /> : <>Avanzar <NavigateNextIcon /></>}
      </Button>
    </form>
  )
}