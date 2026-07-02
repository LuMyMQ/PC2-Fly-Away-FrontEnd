import axios from 'axios'

// Cliente HTTP central. El backend corre en http://localhost:8080.
const api = axios.create({ baseURL: 'http://localhost:8080' })

// Adjunta el JWT guardado en localStorage a cada petición.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api

// Extrae un mensaje de error legible desde una respuesta del backend.
// El backend responde con ProblemDetail: el mensaje vive en `detail`.
export function extractError(err: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { detail?: string; message?: string } | undefined
    if (data?.detail) return data.detail
    if (data?.message) return data.message
    if (err.message) return err.message
  }
  return fallback
}

// Convierte el valor de un input datetime-local (ej. "2026-12-01T00:00")
// a ISO-8601 con timezone (ej. "2026-12-01T05:00:00.000Z"), como espera el backend.
export function toIso(local: string): string | undefined {
  if (!local) return undefined
  return new Date(local).toISOString()
}

// Formatea una fecha ISO del backend a algo legible para el usuario.
export function formatDate(iso: string | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString()
}
