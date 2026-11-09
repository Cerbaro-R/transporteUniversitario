import { useEffect, useState } from 'react'
import { api } from '../services/api'

export default function Home() {
  const [status, setStatus] = useState('verificando...')

  useEffect(() => {
    api('/health')
      .then((data) => setStatus(`API ${data.status}, banco ${data.database}`))
      .catch(() => setStatus('API indisponível'))
  }, [])

  return (
    <main>
      <h1>Transporte Universitário</h1>
      <p>Status: {status}</p>
    </main>
  )
}
