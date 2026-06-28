alter table public.usuarios
  add column if not exists rol text;

alter table public.usuarios
  drop constraint if exists usuarios_rol_check;

update public.usuarios
set rol = case lower(rol)
  when 'admin' then 'admin'
  else 'cliente'
end;

alter table public.usuarios
  alter column rol set default 'cliente',
  alter column rol set not null;

alter table public.usuarios
  add constraint usuarios_rol_check
  check (rol in ('cliente', 'admin'));
