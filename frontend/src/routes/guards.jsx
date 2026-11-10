import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Alert, Box, Button, CircularProgress } from '@mui/material'
import { useAuth } from '../hooks/useAuth'

function Carregando() {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
      <CircularProgress />
    </Box>
  )
}

function SemPermissao() {
  const navigate = useNavigate()
  return (
    <Alert
      severity="warning"
      action={
        <Button color="inherit" size="small" onClick={() => navigate('/')}>
          Voltar ao início
        </Button>
      }
    >
      Permissão insuficiente: esta área é restrita a outro perfil de usuário.
    </Alert>
  )
}

/**
 * Só deixa entrar quem está logado. Com `perfis`, também confere o perfil.
 * Ex.: <RotaPrivada perfis={['organizador']}><ListaPassageiros /></RotaPrivada>
 * Sem children, renderiza as rotas filhas (<Outlet />).
 */
export function RotaPrivada({ perfis, children }) {
  const { usuario, carregando } = useAuth()
  const location = useLocation()

  if (carregando) return <Carregando />
  if (!usuario) return <Navigate to="/login" replace state={{ de: location.pathname }} />
  if (perfis && !perfis.includes(usuario.perfil)) return <SemPermissao />

  return children ?? <Outlet />
}

// Telas de login/cadastro: quem já está logado vai direto para o início
export function SomenteVisitante({ children }) {
  const { usuario, carregando } = useAuth()

  if (carregando) return <Carregando />
  if (usuario) return <Navigate to="/" replace />

  return children
}
