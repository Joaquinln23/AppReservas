-- ============================================
-- AgendaPro - Schema completo
-- Ejecuta esto en Supabase → SQL Editor
-- ============================================

-- Servicios
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration integer not null,
  price integer not null,
  description text default '',
  active boolean default true,
  created_at timestamptz default now()
);

-- Reservas
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_email text not null,
  client_phone text not null,
  date date not null,
  time text not null,
  service_id uuid references services(id),
  notes text default '',
  status text default 'confirmed',
  created_at timestamptz default now()
);

-- Servicios de barbería por defecto
insert into services (name, duration, price, description) values
  ('Corte Clásico', 30, 8000, 'Corte tradicional con tijera y máquina'),
  ('Corte + Barba', 50, 13000, 'Corte completo más arreglo de barba'),
  ('Afeitado con Navaja', 30, 10000, 'Afeitado clásico con navaja caliente'),
  ('Corte + Lavado', 45, 11000, 'Incluye lavado y secado profesional'),
  ('Degradado', 35, 9000, 'Degradado moderno con definición'),
  ('Diseño de Barba', 25, 7000, 'Perfilado y diseño de barba');
