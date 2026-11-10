import { useCallback, useEffect, useMemo, useState } from 'react'
import { api, EVENTO_SESSAO_EXPIRADA, tokenStorage } from '../services/api'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  // Se já existe token salvo, precisamos perguntar à API quem é o usuário
  const [carregando, setCarregando] = useState(() => Boolean(tokenStorage.get()))

  useEffect(() => {
    if (!tokenStorage.get()) return
    api('/auth/eu')
      .then((data) => setUsuario(data.usuario))
      .catch(() => setUsuario(null))
      .finally(() => setCarregando(false))
  }, [])

  useEffect(() => {
    const aoExpirar = () => setUsuario(null)
    window.addEventListener(EVENTO_SESSAO_EXPIRADA, aoExpirar)
    return () => window.removeEventListener(EVENTO_SESSAO_EXPIRADA, aoExpirar)
  }, [])

  const iniciarSessao = useCallback((data) => {
    tokenStorage.set(data.token)
    setUsuario(data.usuario)
    return data.usuario
  }, [])

  const entrar = useCallback(
    async (email, senha) =>
      iniciarSessao(await api('/auth/login', { method: 'POST', body: { email, senha } })),
    [iniciarSessao]
  )

  const cadastrar = useCallback(
    async (dados) => iniciarSessao(await api('/auth/cadastro', { method: 'POST', body: dados })),
    [iniciarSessao]
  )

  const sair = useCallback(() => {
    tokenStorage.remove()
    setUsuario(null)
  }, [])

  const value = useMemo(
    () => ({ usuario, carregando, entrar, cadastrar, sair }),
    [usuario, carregando, entrar, cadastrar, sair]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
