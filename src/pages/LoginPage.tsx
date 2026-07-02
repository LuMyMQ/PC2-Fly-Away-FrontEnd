import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { extractError } from '../api'
import { useAuth } from '../auth'

interface AuthTokenResponse {
  token: string
}

// Pantalla de Login — consume POST /auth/login (sin protección).
export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Ingresa tu email y contraseña.')
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post<AuthTokenResponse>('/auth/login', {
        email: email.trim(),
        password,
      })
      // Guarda el token JWT en localStorage y carga el usuario actual.
      await login(data.token)
      // Redirige a la búsqueda tras login exitoso.
      navigate('/search')
    } catch (err) {
      setError(extractError(err, 'Credenciales incorrectas.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h1>Iniciar sesión</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="form" onSubmit={handleSubmit} noValidate>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alice@example.com"
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password1"
          />
        </label>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Ingresando…' : 'Entrar'}
        </button>
      </form>

      <p className="muted" style={{ marginTop: '1rem' }}>
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  )
}
