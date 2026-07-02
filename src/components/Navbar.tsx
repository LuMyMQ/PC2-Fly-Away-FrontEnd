import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">Fly Away ✈️</div>
      <div className="navbar-links">
        <NavLink to="/search">Búsqueda</NavLink>
        {isAuthenticated && <NavLink to="/bookings">Mis reservas</NavLink>}
        {!isAuthenticated && <NavLink to="/register">Registro</NavLink>}
        {!isAuthenticated && <NavLink to="/login">Login</NavLink>}
        {isAuthenticated && (
          <>
            <span className="navbar-user">
              Hola, {user ? user.firstName : '...'}
            </span>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
