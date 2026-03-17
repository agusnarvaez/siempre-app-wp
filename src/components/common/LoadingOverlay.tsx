import { Box, CircularProgress, Typography } from '@mui/material'

export default function LoadingOverlay() {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        minHeight: '40vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <CircularProgress color="warning" />
      <Typography variant="body1">Cargando aplicacion...</Typography>
    </Box>
  )
}
