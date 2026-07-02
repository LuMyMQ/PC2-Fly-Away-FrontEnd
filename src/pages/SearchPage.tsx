import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import api, { extractError, formatDate, toIso } from '../api'
import { useAuth } from '../auth'
import { addBookingId } from '../bookings'
import type { FlightItem, FlightSearchResponse } from '../types'

// Búsqueda de Vuelos — consume GET /flights/search (sin protección).
export default function SearchPage() {
  const { isAuthenticated } = useAuth()

  const [flightNumber, setFlightNumber] = useState('')
  const [airlineName, setAirlineName] = useState('')
  // Nice to have: filtro por rango de fechas de salida.
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const [results, setResults] = useState<FlightItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Feedback por fila al reservar.
  const [bookingId, setBookingId] = useState<number | null>(null)
  const [bookError, setBookError] = useState<string | null>(null)
  const [bookingFlightId, setBookingFlightId] = useState<number | null>(null)

  async function handleSearch(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setBookingId(null)
    setBookError(null)
    setLoading(true)
    try {
      const { data } = await api.get<FlightSearchResponse>('/flights/search', {
        params: {
          flightNumber: flightNumber.trim() || undefined,
          airlineName: airlineName.trim() || undefined,
          estDepartureTimeFrom: toIso(from),
          estDepartureTimeTo: toIso(to),
        },
      })
      setResults(data.items)
    } catch (err) {
      setError(extractError(err, 'No se pudo realizar la búsqueda.'))
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  // Reservar un Vuelo — consume POST /flights/book (protegido).
  async function handleBook(flightId: number) {
    setBookingId(null)
    setBookError(null)
    setBookingFlightId(flightId)
    try {
      const { data } = await api.post<{ id: number }>('/flights/book', { flightId })
      // Guarda el ID de reserva en localStorage para "Mis reservas".
      addBookingId(data.id)
      setBookingId(data.id)
    } catch (err) {
      setBookError(extractError(err, 'No se pudo reservar el vuelo.'))
    }
  }

  return (
    <div>
      <div className="card">
        <h1>Buscar vuelos</h1>
        <form className="search-grid" onSubmit={handleSearch}>
          <label>
            Número de vuelo
            <input
              type="text"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              placeholder="LA123"
            />
          </label>
          <label>
            Aerolínea
            <input
              type="text"
              value={airlineName}
              onChange={(e) => setAirlineName(e.target.value)}
              placeholder="LATAM"
            />
          </label>
          <label>
            Salida desde
            <input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label>
            Salida hasta
            <input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Buscando…' : 'Buscar'}
          </button>
        </form>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {bookingId !== null && (
        <div className="alert alert-success">
          ¡Reserva creada con éxito! ID de reserva: <strong>{bookingId}</strong>.{' '}
          <Link to={`/bookings/${bookingId}`}>Ver detalle</Link>
        </div>
      )}
      {bookError && <div className="alert alert-error">{bookError}</div>}

      {results !== null && (
        <div className="card">
          <h2>Resultados</h2>
          {results.length === 0 ? (
            <p className="muted">
              No se encontraron vuelos con esos criterios. Prueba con otra búsqueda ✈️
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>N° vuelo</th>
                  <th>Aerolínea</th>
                  <th>Salida</th>
                  <th>Llegada</th>
                  <th>Asientos</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {results.map((f) => (
                  <tr key={f.id}>
                    <td>{f.flightNumber}</td>
                    <td>{f.airlineName}</td>
                    <td>{formatDate(f.estDepartureTime)}</td>
                    <td>{formatDate(f.estArrivalTime)}</td>
                    <td>{f.availableSeats}</td>
                    <td>
                      {isAuthenticated ? (
                        <button
                          className="btn btn-small"
                          onClick={() => handleBook(f.id)}
                          disabled={bookingFlightId === f.id && bookError === null && bookingId === null}
                        >
                          Reservar
                        </button>
                      ) : (
                        <span className="muted" style={{ fontSize: '0.8rem' }}>
                          <Link to="/login">Inicia sesión</Link> para reservar
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
