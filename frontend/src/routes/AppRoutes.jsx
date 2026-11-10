import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from '../components/Layout'
import Cadastro from '../pages/Cadastro'
import Home from '../pages/Home'
import Login from '../pages/Login'
import NaoEncontrada from '../pages/NaoEncontrada'
import NovoOrganizador from '../pages/NovoOrganizador'
import { RotaPrivada, SomenteVisitante } from './guards'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/login" element={<SomenteVisitante><Login /></SomenteVisitante>} />
        <Route path="/cadastro" element={<SomenteVisitante><Cadastro /></SomenteVisitante>} />

        {/* Logado: tudo aqui dentro aparece com o menu (Layout).
            Novas telas entram como <Route> filhas. Para restringir a um perfil,
            envolva o element com <RotaPrivada perfis={[...]}>. */}
        <Route element={<RotaPrivada><Layout /></RotaPrivada>}>
          <Route index element={<Home />} />
          <Route
            path="organizadores/novo"
            element={<RotaPrivada perfis={['organizador']}><NovoOrganizador /></RotaPrivada>}
          />
          <Route path="*" element={<NaoEncontrada />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
