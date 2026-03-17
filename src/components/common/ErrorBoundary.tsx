import { Component, ErrorInfo, ReactNode } from 'react'
import { Alert, Box, Button, Typography } from '@mui/material'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary capturo un error', error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <Box sx={{ p: 3, width: '100%', maxWidth: 560, margin: '5rem auto' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Ocurrio un error inesperado en la aplicacion.
        </Alert>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Podes recargar la pagina para volver a intentar.
        </Typography>
        <Button variant="contained" color="warning" onClick={this.handleReload}>
          Recargar
        </Button>
      </Box>
    )
  }
}
