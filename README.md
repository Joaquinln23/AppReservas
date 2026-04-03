# ✂️ AgendaPro — Barber Booking System

Sistema de agenda online para barberías con panel de administración, autenticación y notificaciones automáticas vía WhatsApp.

---

## 🚀 Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| [Next.js](https://nextjs.org/) | 14.2.5 | Framework fullstack con App Router |
| [React](https://react.dev/) | 18 | UI y componentes |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Tipado estático |
| [Supabase](https://supabase.com/) | 2.x | Base de datos, autenticación y backend |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4 | Estilos utilitarios |
| [CallMeBot](https://www.callmebot.com/) | — | Notificaciones automáticas por WhatsApp |

---

## 📁 Estructura del Proyecto

```
barber-agenda2/
├── app/
│   ├── admin/                  # Panel de administración (protegido)
│   ├── api/
│   │   ├── auth/logout/        # Cierre de sesión
│   │   ├── available/[date]/   # Disponibilidad por fecha
│   │   ├── bookings/           # CRUD de reservas
│   │   │   └── [id]/
│   │   └── services/           # Servicios disponibles
│   ├── login/                  # Autenticación
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── BookingForm.tsx          # Formulario de reserva
│   └── BookingList.tsx          # Listado de turnos
├── lib/
│   ├── supabase.ts              # Cliente Supabase (browser)
│   ├── supabase-server.ts       # Cliente Supabase (server)
│   └── whatsapp.ts              # Integración CallMeBot
└── middleware.ts                 # Protección de rutas
```

---

## ⚙️ Setup

### 1. Clonar e instalar

```bash
git clone https://github.com/tu-usuario/barber-agenda2.git
cd barber-agenda2
npm install
```

### 2. Variables de entorno

Crea `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
CALLMEBOT_API_KEY=tu-api-key
BARBER_PHONE=56912345678
```

> `BARBER_PHONE` debe ser el número sin `+` (ej: `56912345678`)

### 3. Base de datos

Ve a **SQL Editor** en Supabase y ejecuta el archivo `supabase-schema.sql` incluido en el proyecto.

### 4. Crear usuario administrador

1. En Supabase → **Authentication** → **Users**
2. Clic en **"Add user"** → **"Create new user"**
3. Ingresa email y contraseña
4. Ese usuario tendrá acceso a `/admin`

### 5. Configurar WhatsApp (CallMeBot)

1. Guarda **+34 644 60 49 48** en contactos como "CallMeBot"
2. Envíale el mensaje: `I allow callmebot to send me messages`
3. Recibirás tu **API key** por WhatsApp
4. Agrega esa key a `CALLMEBOT_API_KEY` en `.env.local`

> ⚠️ El número del barbero debe activar CallMeBot con su propio teléfono.

### 6. Correr en desarrollo

```bash
npm run dev
```

| URL | Descripción |
|---|---|
| http://localhost:3000 | Vista cliente — reserva de citas |
| http://localhost:3000/login | Login administrador |
| http://localhost:3000/admin | Panel admin (requiere login) |

---

## 🔑 Funcionalidades

- 📅 **Reserva de turnos** — Clientes agendan citas por fecha y horario disponible
- 🔐 **Autenticación** — Login seguro con Supabase Auth + middleware de protección
- 🛠️ **Panel admin** — Gestión completa de reservas y servicios
- 📲 **Notificaciones WhatsApp** — Confirmación automática al cliente y al barbero al reservar
- ✅ **Disponibilidad en tiempo real** — Los horarios se actualizan dinámicamente

---

## 🗄️ Base de Datos

**`services`**

| Campo | Tipo | Descripción |
|---|---|---|
| id | uuid | Identificador único |
| name | text | Nombre del servicio |
| duration | int | Duración en minutos |
| price | numeric | Precio |
| description | text | Descripción |
| active | boolean | Si está disponible |

**`bookings`**

| Campo | Tipo | Descripción |
|---|---|---|
| id | uuid | Identificador único |
| client_name | text | Nombre del cliente |
| client_email | text | Email del cliente |
| client_phone | text | Teléfono del cliente |
| date | date | Fecha del turno |
| time | time | Hora del turno |
| service_id | uuid | Servicio reservado |
| notes | text | Notas adicionales |
| status | enum | `confirmed` / `cancelled` |
| created_at | timestamp | Fecha de creación |

---

## 🌐 Deploy en Vercel

```bash
vercel
```

Agrega estas variables de entorno en el dashboard de Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `CALLMEBOT_API_KEY`
- `BARBER_PHONE`

---

## 📦 Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Iniciar en producción
```

---

## 📄 Licencia

MIT
