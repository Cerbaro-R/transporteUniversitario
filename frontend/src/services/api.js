// Cliente HTTP central: todas as chamadas à API passam por aqui.
// Ele já envia o token de login e transforma respostas de erro em ApiError.
const BASE_URL = '/api'
const TOKEN_KEY = 'transporte.token'

export const tokenStorage = {
  get() {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set(token) {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      // navegador sem localStorage (ex.: modo privado restrito): segue sem salvar
    }
  },
  remove() {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      // idem
    }
  },
}

export class ApiError extends Error {
  constructor(message, status, erros = {}) {
    super(message)
    this.status = status
    this.erros = erros // erros por campo, ex.: { email: 'E-mail já cadastrado.' }
  }
}

// Evento disparado quando a API recusa o token (expirado/inválido).
// O AuthContext escuta e desloga o usuário.
export const EVENTO_SESSAO_EXPIRADA = 'auth:sessao-expirada'

/**
 * Ex.: api('/auth/login', { method: 'POST', body: { email, senha } })
 */
export async function api(path, { body, headers, ...options } = {}) {
  const token = tokenStorage.get()

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor.', 0)
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401 && token) {
      tokenStorage.remove()
      window.dispatchEvent(new Event(EVENTO_SESSAO_EXPIRADA))
    }
    throw new ApiError(data?.message || `Erro ${response.status}`, response.status, data?.erros)
  }

  return data
}
