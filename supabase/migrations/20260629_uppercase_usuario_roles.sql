alter table public.usuarios
  drop constraint if exists usuarios_rol_check;

update public.usuarios
set rol = upper(rol);

alter table public.usuarios
  alter column rol set default 'CLIENTE';

alter table public.usuarios
  add constraint usuarios_rol_check
  check (rol in ('ADMIN', 'CLIENTE'));
