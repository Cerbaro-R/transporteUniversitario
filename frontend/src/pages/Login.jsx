import { useState } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Link, TextField, Typography } from '@mui/material'
import CampoSenha from '../components/CampoSenha'
import TelaPublica from '../components/TelaPublica'
import { useAuth } from '../hooks/useAuth'

// RF01 / caso de uso 1 — Realizar login
export default function Login() {
  const { entrar } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!email.trim() || !senha) {
      setErro('Informe e-mail e senha.')
      return
    }

    setErro('')
    setEnviando(true)
    try {
      await entrar(email, senha)
      navigate(location.state?.de || '/', { replace: true })
    } catch (err) {
      setErro(err.message)
      setEnviando(false)
    }
  }

  return (
    <TelaPublica titulo="Entrar" subtitulo="Acesse com seu e-mail e senha.">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}
        <TextField
          label="E-mail"
          type="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={enviando}
          sx={{ mb: 2 }}
        />
        <CampoSenha
          label="Senha"
          autoComplete="current-password"
          fullWidth
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          disabled={enviando}
          sx={{ mb: 3 }}
        />
        <Button type="submit" variant="contained" size="large" fullWidth loading={enviando}>
          Entrar
        </Button>
        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
          Ainda não tem conta?{' '}
          <Link component={RouterLink} to="/cadastro">
            Cadastre-se
          </Link>
        </Typography>
      </Box>
    </TelaPublica>
  )
}
