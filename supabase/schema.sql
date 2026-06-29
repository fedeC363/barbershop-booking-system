create table if not exists public.usuarios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellido text not null,
  mail text not null unique,
  dni text not null unique,
  rol text not null default 'CLIENTE' check (rol in ('ADMIN', 'CLIENTE'))
);

create table if not exists public.peluqueros (
  id uuid primary key default gen_random_uuid(),
  nombre text unique not null
);

insert into public.peluqueros (nombre)
values
  ('Matias'),
  ('Lionel'),
  ('Lucas'),
  ('Franco')
on conflict (nombre) do nothing;

create table if not exists public.turnos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios(id),
  peluquero_id uuid references public.peluqueros(id),
  fecha date not null,
  hora time not null,
  servicio text not null,
  precio numeric(10,2) not null,
  estado text not null check (estado in ('PENDIENTE', 'CONFIRMADO', 'CANCELADO', 'FINALIZADO'))
);

alter table public.turnos drop constraint if exists turnos_estado_check;
alter table public.turnos
  add constraint turnos_estado_check
  check (estado in ('PENDIENTE', 'CONFIRMADO', 'CANCELADO', 'FINALIZADO'));

alter table public.turnos drop constraint if exists turnos_peluquero_id_fkey;
alter table public.turnos alter column peluquero_id drop not null;
update public.turnos set peluquero_id = null
where peluquero_id is not null
  and not exists (
    select 1
    from public.peluqueros
    where peluqueros.id = turnos.peluquero_id
  );
alter table public.turnos
  add constraint turnos_peluquero_id_fkey
  foreign key (peluquero_id) references public.peluqueros(id);
