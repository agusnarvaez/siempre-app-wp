// theme.ts
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#f15a24', // color primario
    },
    secondary: {
      main: '#808080', // color secundario
    },
    background: {
      default: '#f2f2f2', // color terciario (fondo)
    },
    text: {
      // Usamos un negro que no sea tan puro para contrastar.
      primary: '#333333',
    },
  },
})

export default theme
