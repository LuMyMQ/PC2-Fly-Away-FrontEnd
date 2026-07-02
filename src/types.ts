// Tipos que reflejan las respuestas del backend Fly Away.

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: 'USER' | 'ADMIN'
}

export interface FlightItem {
  id: number
  airlineName: string
  flightNumber: string
  estDepartureTime: string
  estArrivalTime: string
  availableSeats: number
}

export interface FlightSearchResponse {
  items: FlightItem[]
}

export interface Booking {
  id: number
  bookingDate: string
  flightId: number
  flightNumber: string
  estDepartureTime: string
  estArrivalTime: string
  customerId: number
  customerFirstName: string
  customerLastName: string
}
