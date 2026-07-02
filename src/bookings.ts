// Utilidades para persistir los IDs de reservas del usuario en localStorage.
const KEY = 'bookingIds'

export function getBookingIds(): number[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'number') : []
  } catch {
    return []
  }
}

export function addBookingId(id: number): void {
  const ids = getBookingIds()
  if (!ids.includes(id)) {
    ids.push(id)
    localStorage.setItem(KEY, JSON.stringify(ids))
  }
}
