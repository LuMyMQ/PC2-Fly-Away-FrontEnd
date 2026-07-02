# Fly Away — Frontend ✈️

 **React 18 + TypeScript + Vite** que consume la API de reserva de vuelos *Fly Away*.

## Requisitos

- Node.js 18+ y npm
- El backend corriendo en `http://localhost:8080`

## Cómo correrlo

1. **Iniciar el backend** (desde la carpeta raíz de la repo dad por el TA):

   ```bash
   ./mvnw spring-boot:run
   ```

2. **Instalar dependencias e inicia el frontend** (desde esta carpeta):

   ```bash
   cd fly-away-frontend
   npm install
   npm run dev
   ```

3. Abre `http://localhost:5173` en el navegador.

## Funcionalidades implementadas

| Funcionalidad | Endpoint | Estado |
|---------------|----------|--------|
| Registro | `POST /users/register` | ✅ must have |
| Login (guarda JWT en localStorage) | `POST /auth/login` | ✅ must have |
| Mostrar usuario autenticado | `GET /users/current` | ✅ nice to have |
| Búsqueda de vuelos | `GET /flights/search` | ✅ must have |
| Filtro por rango de fechas | `GET /flights/search` | ✅ nice to have |
| Reservar vuelo | `POST /flights/book` | ✅ must have |
| Ver detalle de reserva | `GET /flights/book/{id}` | ✅ nice to have |
| Mis reservas (IDs en localStorage) | `GET /flights/book/{id}` | ✅ nice to have |
| Cerrar sesión + rutas protegidas | — | ✅ must have |

## Estructura

```
src/
├── api.ts            # Cliente Axios + interceptor JWT + helpers
├── auth.tsx          # Contexto de autenticación (token + usuario actual)
├── bookings.ts       # Persistencia de IDs de reservas en localStorage
├── types.ts          # Tipos de las respuestas del backend
├── components/
│   ├── Navbar.tsx        # Navegación + logout + nombre del usuario
│   └── ProtectedRoute.tsx # Redirige al login si no hay token
└── pages/
    ├── RegisterPage.tsx
    ├── LoginPage.tsx
    ├── SearchPage.tsx        # Búsqueda + reservar
    ├── BookingsPage.tsx      # Mis reservas
    └── BookingDetailPage.tsx # Detalle de una reserva
```

## Notas

- El JWT se guarda en `localStorage` bajo la clave `token` y se adjunta
  automáticamente en cada petición mediante un interceptor de Axios.
- Los IDs de las reservas creadas se guardan en `localStorage` (clave
  `bookingIds`) para poder listarlas en *Mis reservas*.
- Los errores del backend se muestran leyendo `error.response.data.detail`
  (formato `ProblemDetail` de Spring).
- Las fechas ISO-8601 del backend se muestran con `toLocaleString()`.
