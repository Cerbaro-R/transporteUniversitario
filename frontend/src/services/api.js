// Cliente HTTP central: todas as chamadas à API passam por aqui.
const BASE_URL = '/api'

export async function api(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.message || `Erro ${response.status}`)
  }
  return data
}
