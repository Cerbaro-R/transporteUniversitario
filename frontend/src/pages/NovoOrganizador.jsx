import { useState } from 'react'
import { Alert, Box, Button, Card, CardContent, Typography } from '@mui/material'
import CamposUsuario from '../components/CamposUsuario'
import { dadosParaApi, USUARIO_VAZIO, validarUsuario } from '../utils/usuarioForm'
import { api } from '../services/api'

// RF02 — Organizador cadastra outro organizador
export default function NovoOrganizador() {
  const [valores, setValores] = useState(USUARIO_VAZIO)
  const [erros, setErros] = useState({})
  const [mensagem, setMensagem] = useState(null) // { tipo: 'success' | 'error', texto }
  const [enviando, setEnviando] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setValores((v) => ({ ...v, [name]: value }))
    setErros((e) => ({ ...e, [name]: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const encontrados = validarUsuario(valores)
    setErros(encontrados)
    if (Object.keys(encontrados).length) return

    setMensagem(null)
    setEnviando(true)
    try {
      const { usuario } = await api('/usuarios/organizadores', {
        method: 'POST',
        body: dadosParaApi(valores),
      })
      setValores(USUARIO_VAZIO)
      setMensagem({ tipo: 'success', texto: `${usuario.nome} foi cadastrado como organizador.` })
    } catch (err) {
      setErros(err.erros || {})
      setMensagem({ tipo: 'error', texto: err.message })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Novo organizador
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Organizadores podem enviar avisos e ver a lista de passageiros.
      </Typography>
      <Card variant="outlined">
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {mensagem && (
              <Alert severity={mensagem.tipo} sx={{ mb: 2 }}>
                {mensagem.texto}
              </Alert>
            )}
            <CamposUsuario valores={valores} erros={erros} onChange={handleChange} disabled={enviando} />
            <Button type="submit" variant="contained" loading={enviando}>
              Cadastrar organizador
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
