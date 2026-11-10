import { Alert, Box, Typography } from '@mui/material'
import { useAuth } from '../hooks/useAuth'

// Tela inicial. O dashboard do RF03 (status do ônibus, avisos e previsão)
// vai substituir o conteúdo provisório abaixo.
export default function Home() {
  const { usuario } = useAuth()
  const primeiroNome = usuario.nome.split(' ')[0]

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Olá, {primeiroNome}!
      </Typography>
      <Alert severity="info">
        O dashboard com status do ônibus, avisos e previsão de chegada ainda vai ser construído.
      </Alert>
    </Box>
  )
}
