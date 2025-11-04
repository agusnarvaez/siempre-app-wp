// theme.ts
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#f15a24',
    },
    secondary: {
      main: '#808080',
    },
    background: {
      default: '#1e1e1e', // fondo oscuro real
      paper: '#2a2a2a',
    },
    text: {
      primary: '#ffffff', // texto blanco
      secondary: '#cccccc',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
          colorScheme: 'light',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#cccccc', // color del label por defecto
          '&.Mui-focused': {
            color: '#f15a24', // color del label al enfocar
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#777', // borde normal
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#f15a24', // borde hover
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#f15a24', // borde focus
          },
        },
        input: {
          color: '#ffffff', // color del texto del input
        },
      },
    },
  }
})

export default theme
