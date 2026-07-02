import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { formatDate } from '../api'
import { getBookingIds } from '../bookings'
import type { Booking, FlightItem } from '../types'

// Fila de "Mis reservas": la reserva + la aerolínea del vuelo.
// El endpoint de reserva no devuelve la aerolínea, así que la
// obtenemos con GET /flights/{flightId}.
interface BookingRow extends Booking {
  airlineName: string
}

// Mis Reservas — consume GET /flights/book/{id} (protegido).
export default function BookingsPage() {
  const [rows, setRows] = useState<BookingRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ids = getBookingIds()
    if (ids.length === 0) {
      setLoading(false)
      return
    }

    async function load() {
      const loaded: BookingRow[] = []
      for (const id of ids) {
        try {
          const { data: booking } = await api.get<Booking>(`/flights/book/${id}`)
          let airlineName = '—'
          try {
            const { data: flight } = await api.get<FlightItem>(`/flights/${booking.flightId}`)
            airlineName = flight.airlineName
          } catch {
            // Si el vuelo ya no existe, dejamos la aerolínea en blanco.
          }
          loaded.push({ ...booking, airlineName })
        } catch {
          // Reserva no disponible: la omitimos.
        }
      }
      setRows(loaded)
      setLoading(false)
    }

    load()
  }, [])

  if (loading) {
    return <p className="muted">Cargando tus reservas…</p>
  }

  return (
    <div className="card">
      <h1>Mis reservas</h1>
      {rows.length === 0 ? (
        <p className="muted">
          Todavía no tienes reservas. Ve a <Link to="/search">Búsqueda</Link> y reserva un vuelo ✈️
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Reserva</th>
              <th>N° vuelo</th>
              <th>Aerolínea</th>
              <th>Fecha de salida</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id}>
                <td>#{b.id}</td>
                <td>{b.flightNumber}</td>
                <td>{b.airlineName}</td>
                <td>{formatDate(b.estDepartureTime)}</td>
                <td>
                  <Link className="btn btn-small btn-ghost" to={`/bookings/${b.id}`}>
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
