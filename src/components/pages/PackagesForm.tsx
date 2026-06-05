import { useContext, useRef, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { CSVContext } from '../../context/CSVContext'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import Button from '@mui/material/Button'
import { Alert, CircularProgress, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { parseCSVRows } from '../../utils/csvParser'
import { isSupportedPackageFile, parsePackageFile } from '../../utils/fileParser'

type FormData = {
  file: FileList
  timeRange: number
}

export default function PackagesForm() {
  const { setCSVData } = useContext(CSVContext)
  const navigate = useNavigate()
  const hiddenFileInput = useRef<HTMLInputElement | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>()

  const fileRegister = register('file')
  const watchedFile = watch('file')

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!data.file || data.file.length === 0) {
      setError('file', {
        type: 'manual',
        message: 'El archivo es obligatorio',
      })
      return
    }

    const file = data.file[0]
    setIsProcessing(true)

    try {
      const allRows = await parsePackageFile(file)
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
        message: `Error parseando archivo: ${message}`,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClickOpenFile = () => {
    hiddenFileInput.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      clearErrors('file')
      return
    }

    if (!isSupportedPackageFile(file)) {
      setError('file', {
        type: 'manual',
        message: 'Solo se permiten archivos .csv o .xlsx',
      })
      e.target.value = ''
      return
    }

    clearErrors('file')
    fileRegister.onChange(e)
  }

  const isFileLoaded = watchedFile?.length === 1

  return (
    <form className="packages-form" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Rango horario (en horas)"
        type="number"
        variant="outlined"
        defaultValue={2}
        sx={{ marginBottom: 2 }}
        inputProps={{
          min: 2,
        }}
        error={!!errors.timeRange}
        helperText={errors.timeRange?.message}
        {...register('timeRange', {
          required: 'El rango horario es obligatorio',
          valueAsNumber: true,
          min: {
            value: 2,
            message: 'El rango debe ser al menos 1',
          },
        })}
      />

      <input
        id="file-input"
        type="file"
        accept=".csv,.xlsx"
        style={{ display: 'none' }}
        ref={(node) => {
          fileRegister.ref(node)
          hiddenFileInput.current = node
        }}
        name={fileRegister.name}
        onBlur={fileRegister.onBlur}
        onChange={handleFileChange}
      />

      {isFileLoaded && (
        <p>
          <b>Archivo seleccionado:</b> {watchedFile?.[0]?.name}
        </p>
      )}

      {errors.file && (
        <Alert severity="error">{errors.file.message}</Alert>
      )}

      <Button
        variant="outlined"
        type="button"
        onClick={handleClickOpenFile}
        aria-label="Cargar archivo CSV o Excel"
      >
        <UploadFileIcon /> Cargar archivo
      </Button>

      <Button
        variant={isFileLoaded ? 'contained' : 'outlined'}
        disabled={!isFileLoaded || isProcessing}
        type="submit"
        aria-label="Procesar archivo y continuar"
      >
        {isProcessing ? <CircularProgress size={20} color="inherit" /> : <>Avanzar <NavigateNextIcon /></>}
      </Button>
    </form>
  )
}
