# AgendaPro — Guía de Setup

## 1. Instalar dependencias

```bash
npm install
```

---

## 2. Supabase — ya configurado
Tus keys ya están en `.env.local`. Solo ejecuta el nuevo schema si no lo hiciste:
Ve a **SQL Editor** en Supabase y ejecuta `supabase-schema.sql`.

---

## 3. Crear tu usuario administrador

1. En Supabase → **Authentication** → **Users**
2. Haz clic en **"Add user"** → **"Create new user"**
3. Pon tu email y una contraseña segura
4. ¡Listo! Ese usuario puede acceder a `/admin`

---

## 4. Configurar CallMeBot (WhatsApp automático)

1. Guarda **+34 644 60 49 48** en contactos como "CallMeBot"
2. Envía: `I allow callmebot to send me messages`
3. Recibirás tu **API key**
4. En `.env.local`:
   - `CALLMEBOT_API_KEY` = tu key
   - `BARBER_PHONE` = número del barbero sin `+` (ej: `56912345678`)

> ⚠️ El barbero debe activar CallMeBot con su propio número.

---

## 5. Correr en local

```bash
npm run dev
```

- Vista cliente: http://localhost:3000
- Login admin: http://localhost:3000/login
- Panel admin: http://localhost:3000/admin (requiere login)

---

## 6. Deploy en Vercel

```bash
vercel
```

Variables de entorno a agregar en Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `CALLMEBOT_API_KEY`
- `BARBER_PHONE`

---

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Cliente reserva su cita |
| `/login` | Login administrador |
| `/admin` | Panel admin (protegido) |
