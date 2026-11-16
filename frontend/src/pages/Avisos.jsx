import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { api } from '../services/api'

function formatarData(valor) {
  return new Date(valor).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

export default function Avisos() {
  const [avisos, setAvisos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroLista, setErroLista] = useState('')
  const [texto, setTexto] = useState('')
  const [erroCampo, setErroCampo] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mensagem, setMensagem] = useState(null)

  const carregar = useCallback(async () => {
    try {
      const dados = await api('/avisos')
      setAvisos(Array.isArray(dados) ? dados : [])
      setErroLista('')
    } catch (err) {
      setErroLista(err.message)
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function handleSubmit(event) {
    event.preventDefault()
    setMensagem(null)

    if (!texto.trim()) {
      setErroCampo('Escreva a mensagem do aviso.')
      return
    }

    setErroCampo('')
    setEnviando(true)
    try {
      await api('/avisos', { method: 'POST', body: { mensagem: texto } })
      setTexto('')
      setMensagem({ tipo: 'success', texto: 'Aviso enviado com sucesso.' })
      await carregar()
    } catch (err) {
      setMensagem({ tipo: 'error', texto: err.message })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Avisos
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Envie um aviso para os passageiros e veja os avisos já enviados.
      </Typography>

      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {mensagem && (
              <Alert severity={mensagem.tipo} sx={{ mb: 2 }}>
                {mensagem.texto}
              </Alert>
            )}
            <TextField
              label="Mensagem do aviso"
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
              error={Boolean(erroCampo)}
              helperText={erroCampo}
              disabled={enviando}
              multiline
              minRows={3}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar aviso'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h6" component="h2" gutterBottom>
        Avisos enviados
      </Typography>

      {carregando && <CircularProgress size={28} />}
      {erroLista && <Alert severity="error">{erroLista}</Alert>}
      {!carregando && !erroLista && avisos.length === 0 && (
        <Typography color="text.secondary">Nenhum aviso enviado ainda.</Typography>
      )}

      <Stack spacing={1.5}>
        {avisos.map((aviso) => (
          <Card key={aviso.id} variant="outlined">
            <CardContent>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>{aviso.mensagem}</Typography>
              <Typography variant="caption" color="text.secondary">
                {aviso.autor?.nome ?? 'Organizador'} - {formatarData(aviso.createdAt)} -{' '}
                {aviso.rotaId ? `Rota ${aviso.rotaId}` : 'Todas as rotas'}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}
