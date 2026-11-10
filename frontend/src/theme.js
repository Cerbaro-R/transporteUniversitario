import { createTheme } from '@mui/material/styles'

// Tema único do app: alterem cores e fontes só aqui.
const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#1f3a93' },
        secondary: { main: '#f57c00' },
        background: { default: '#f4f6fb' },
      },
    },
    dark: {
      palette: {
        primary: { main: '#8fa8ff' },
        secondary: { main: '#ffb74d' },
      },
    },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiTextField: { defaultProps: { fullWidth: true } },
  },
})

export default theme
