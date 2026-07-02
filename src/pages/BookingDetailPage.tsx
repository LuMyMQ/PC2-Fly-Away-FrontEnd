import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api, { extractError, formatDate } from '../api'
import type { Booking } from '../types'

// Detalle de reserva — consume GET /flights/book/{id} (protegido).
export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get<Booking>(`/flights/book/${id}`)
        setBooking(data)
      } catch (err) {
        setError(extractError(err, 'No se pudo cargar la reserva.'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <p className="muted">Cargando reserva…</p>
  if (error) return <div className="alert alert-error">{error}</div>
  if (!booking) return null

  return (
    <div className="card">
      <h1>Reserva #{booking.id}</h1>
      <table>
        <tbody>
          <tr>
            <th>Número de vuelo</th>
            <td>{booking.flightNumber}</td>
          </tr>
          <tr>
            <th>Fecha de reserva</th>
            <td>{formatDate(booking.bookingDate)}</td>
          </tr>
          <tr>
            <th>Salida</th>
            <td>{formatDate(booking.estDepartureTime)}</td>
          </tr>
          <tr>
            <th>Llegada</th>
            <td>{formatDate(booking.estArrivalTime)}</td>
          </tr>
          <tr>
            <th>Pasajero</th>
            <td>
              {booking.customerFirstName} {booking.customerLastName}
            </td>
          </tr>
        </tbody>
      </table>
      <p style={{ marginTop: '1rem' }}>
        <Link to="/bookings">← Volver a mis reservas</Link>
      </p>
    </div>
  )
}
