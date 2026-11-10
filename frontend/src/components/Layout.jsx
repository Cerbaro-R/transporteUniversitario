import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  AppBar,
  Box,
  Chip,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import { useAuth } from '../hooks/useAuth'
import itensMenu from './menu'

const LARGURA_MENU = 240
const NOME_PERFIL = { aluno: 'Aluno', organizador: 'Organizador' }

export default function Layout() {
  const { usuario, sair } = useAuth()
  const [menuAberto, setMenuAberto] = useState(false)

  const itens = itensMenu.filter((item) => item.perfis.includes(usuario.perfil))

  const conteudoMenu = (
    <List sx={{ px: 1 }}>
      {itens.map(({ texto, caminho, icone: Icone }) => (
        <ListItemButton
          key={caminho}
          component={NavLink}
          to={caminho}
          end
          onClick={() => setMenuAberto(false)}
          sx={{ borderRadius: 2, mb: 0.5, '&.active': { bgcolor: 'action.selected' } }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Icone />
          </ListItemIcon>
          <ListItemText primary={texto} />
        </ListItemButton>
      ))}
    </List>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            aria-label="Abrir menu"
            onClick={() => setMenuAberto(true)}
            sx={{ mr: 1, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <DirectionsBusIcon sx={{ mr: 1 }} />
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Transporte Universitário
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1, mr: 1 }}>
            <Typography variant="body2">{usuario.nome}</Typography>
            <Chip
              label={NOME_PERFIL[usuario.perfil]}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: 'inherit' }}
            />
          </Box>
          <Tooltip title="Sair">
            <IconButton color="inherit" onClick={sair} aria-label="Sair">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Celular: menu que abre por cima */}
      <Drawer
        variant="temporary"
        open={menuAberto}
        onClose={() => setMenuAberto(false)}
        sx={{ display: { md: 'none' }, '& .MuiDrawer-paper': { width: LARGURA_MENU } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography fontWeight={600}>{usuario.nome}</Typography>
          <Typography variant="body2" color="text.secondary">
            {NOME_PERFIL[usuario.perfil]}
          </Typography>
        </Box>
        {conteudoMenu}
      </Drawer>

      {/* Desktop: menu fixo na lateral */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: LARGURA_MENU,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: LARGURA_MENU, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ pt: 1 }}>{conteudoMenu}</Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, sm: 3 } }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}
