import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Link, Typography } from '@mui/material'
import CamposUsuario from '../components/CamposUsuario'
import { dadosParaApi, USUARIO_VAZIO, validarUsuario } from '../utils/usuarioForm'
import TelaPublica from '../components/TelaPublica'
import { useAuth } from '../hooks/useAuth'

// RF02 — Cadastro público (sempre cria um aluno)
export default function Cadastro() {
  const { cadastrar } = useAuth()
  const navigate = useNavigate()

  const [valores, setValores] = useState(USUARIO_VAZIO)
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
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

    setErroGeral('')
    setEnviando(true)
    try {
      await cadastrar(dadosParaApi(valores))
      navigate('/', { replace: true })
    } catch (err) {
      setErros(err.erros || {})
      setErroGeral(err.message)
      setEnviando(false)
    }
  }

  return (
    <TelaPublica
      titulo="Criar conta de aluno"
      subtitulo="Cadastre-se para confirmar presença e acompanhar o ônibus."
      larguraMaxima={620}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {erroGeral && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erroGeral}
          </Alert>
        )}
        <CamposUsuario valores={valores} erros={erros} onChange={handleChange} disabled={enviando} />
        <Button type="submit" variant="contained" size="large" fullWidth loading={enviando} sx={{ mt: 1 }}>
          Criar conta
        </Button>
        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
          Já tem conta?{' '}
          <Link component={RouterLink} to="/login">
            Entrar
          </Link>
        </Typography>
      </Box>
    </TelaPublica>
  )
}
