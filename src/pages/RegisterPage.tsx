import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { extractError } from '../api'

// Pantalla de Registro — consume POST /users/register (sin protección).
export default function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Validación de campos vacíos antes de enviar.
  function validate(): string | null {
    if (!email.trim() || !firstName.trim() || !lastName.trim() || !password.trim()) {
      return 'Todos los campos son obligatorios.'
    }
    return null
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      await api.post('/users/register', {
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password,
      })
      setSuccess('¡Cuenta creada con éxito! Redirigiendo al login…')
      // Redirige al login tras un breve mensaje de éxito.
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      // Muestra errores del backend (contraseña débil, email en uso, etc.).
      setError(extractError(err, 'No se pudo completar el registro.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h1>Crear cuenta</h1>
      <p className="muted">
        La contraseña debe tener al menos 8 caracteres, una mayúscula y un dígito.
        El nombre y el apellido deben empezar con mayúscula.
      </p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

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
          Nombre
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Alice"
          />
        </label>
        <label>
          Apellido
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Smith"
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
          {loading ? 'Creando…' : 'Registrarme'}
        </button>
      </form>
    </div>
  )
}
