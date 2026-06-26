create table if not exists public.usuarios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellido text not null,
  mail text not null unique,
  dni text not null unique,
  rol text not null check (rol in ('ADMIN', 'CLIENTE'))
);

create table if not exists public.turnos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios(id),
  peluquero_id uuid not null references public.usuarios(id),
  fecha date not null,
  hora time not null,
  servicio text not null,
  precio numeric(10,2) not null,
  estado text not null check (estado in ('CONFIRMADO', 'CANCELADO'))
);