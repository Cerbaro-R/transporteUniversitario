import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'

export default function NaoEncontrada() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Página não encontrada
      </Typography>
      <Button component={RouterLink} to="/" variant="outlined" sx={{ mt: 2 }}>
        Voltar ao início
      </Button>
    </Box>
  )
}
