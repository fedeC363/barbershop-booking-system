# Aranguri Barbershop

Sistema web de gestión y reserva de turnos para barbería desarrollado con React, TypeScript y Supabase.

## Live Demo

https://barbershop-booking-system-rouge.vercel.app

## Repositorio

https://github.com/fedeC363/barbershop-booking-system

---

## Descripción

Aranguri Barbershop permite a los clientes registrarse, iniciar sesión y reservar turnos online seleccionando fecha, horario, servicio y peluquero.

Además, cuenta con un panel de administración protegido mediante roles, desde donde los administradores pueden visualizar, confirmar o cancelar turnos.

---

## Funcionalidades

### Clientes

* Registro de usuarios
* Inicio de sesión con Supabase Auth
* Reserva de turnos
* Selección de fecha disponible
* Selección de horario
* Selección de peluquero
* Selección de servicio
* Visualización de turnos propios
* Consulta del estado de cada turno

### Administradores

* Acceso mediante roles
* Ruta protegida para administradores
* Visualización de todos los turnos registrados
* Confirmación de turnos
* Cancelación de turnos

---

## Características técnicas

## Características técnicas

* Calendario de reservas navegable
* Restricción de reservas a los próximos 60 días
* Bloqueo de horarios ocupados
* Validación de conflictos de reserva
* Diseño responsive

---

## Stack tecnológico

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui

### Backend y Base de Datos

* Supabase
* PostgreSQL

### Deploy

* Vercel

---

## Arquitectura y decisiones técnicas

### Autenticación y gestión de usuarios

Se utilizó Supabase Auth para delegar la gestión de autenticación, sesiones y credenciales. Esta decisión permitió reducir complejidad en el backend y enfocarse en la lógica de negocio de la aplicación.

Los perfiles de usuario se almacenan en una tabla independiente (`usuarios`) vinculada al identificador generado por Supabase Auth.

### Gestión de roles

La aplicación implementa dos roles:

* CLIENTE
* ADMIN

La autorización se realiza tanto en frontend como en base de datos.

En el frontend, las rutas administrativas están protegidas mediante componentes de autorización.

En la base de datos, las políticas de Row Level Security (RLS) garantizan que únicamente los administradores puedan ejecutar acciones de gestión sobre los turnos.

### Seguridad

Se utilizaron políticas RLS en Supabase para aplicar el principio de mínimo privilegio.

Las principales restricciones implementadas son:

* Los usuarios solo pueden visualizar sus propios turnos.
* Los usuarios autenticados pueden crear turnos.
* Los administradores pueden confirmar y cancelar turnos.
* Las operaciones sensibles no dependen exclusivamente de validaciones del frontend.

### Gestión de reservas

Para evitar conflictos de agenda se implementaron dos niveles de validación:

#### Validación visual

Los horarios ya reservados se muestran deshabilitados durante la selección.

#### Validación transaccional

Antes de registrar una reserva se verifica nuevamente la disponibilidad del horario en la base de datos.

De esta forma se evita que dos usuarios reserven simultáneamente el mismo turno.

### Diseño de la experiencia de usuario

La interfaz fue diseñada para priorizar simplicidad y rapidez de uso.

Las decisiones principales fueron:

* Flujo de reserva en pocos pasos.
* Visualización clara del estado de cada turno.
* Calendario navegable para futuras reservas.
* Diferenciación visual de estados mediante colores.
* Panel administrativo separado del flujo de cliente.

### Escalabilidad

La solución fue diseñada de forma modular:

* Contexto centralizado para autenticación.
* Componentes reutilizables.
* Separación entre lógica de negocio y presentación.
* Integración desacoplada con Supabase.

---

## Instalación local

Clonar el repositorio:

```bash
git clone https://github.com/fedeC363/barbershop-booking-system.git
```

Instalar dependencias:

```bash
npm install
```

Crear archivo `.env.local`:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Ejecutar la aplicación:

```bash
npm run dev
```

---
## Capturas de pantalla

![Login](/img/capturas/Login.png)

## Autor

Federico Cuda

LinkedIn:
https://www.linkedin.com/in/federico-cuda-0763b6324/
