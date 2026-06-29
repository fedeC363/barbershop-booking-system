import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

type Service = "Corte" | "Barba" | "Corte y Barba";
type Barber = {
  id: string;
  nombre: string;
};

const hours = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];
const services: Service[] = ["Corte", "Barba", "Corte y Barba"];
const weekDays = ["Mar", "Mié", "Jue", "Vie", "Sáb"];

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function BookAppointment() {
  const navigate = useNavigate();
  const [fecha, setFecha] = useState("");
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  });
  const [hora, setHora] = useState("");
  const [servicio, setServicio] = useState<Service | null>(null);
  const [peluqueroId, setPeluqueroId] = useState("");
  const [peluqueros, setPeluqueros] = useState<Barber[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 60);

  const firstDayOfMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth(),
    1,
  );
  const calendarStart = new Date(firstDayOfMonth);
  calendarStart.setDate(calendarStart.getDate() - calendarStart.getDay());
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);
    return date;
  });
  const openCalendarDays = calendarDays.filter(
    (date) => date.getDay() !== 0 && date.getDay() !== 1,
  );
  const monthTitle = visibleMonth.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastAvailableMonth = new Date(
    maxDate.getFullYear(),
    maxDate.getMonth(),
    1,
  );
  const canGoToPreviousMonth = visibleMonth > currentMonth;
  const canGoToNextMonth = visibleMonth < lastAvailableMonth;

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!isMounted) return;
      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      const { data, error: barbersError } = await supabase
        .from("peluqueros")
        .select("id, nombre")
        .order("nombre");

      if (!isMounted) return;
      if (barbersError) {
        setError(barbersError.message);
      } else {
        setPeluqueros(data ?? []);
      }
      setIsCheckingAuth(false);
    };

    void checkAuth();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    const selectedDate = fecha ? parseLocalDate(fecha) : null;

    // Los domingos (0) y lunes (1), además de fechas fuera del rango, no son reservables.
    if (
      !selectedDate ||
      selectedDate < today ||
      selectedDate > maxDate ||
      selectedDate.getDay() === 0 ||
      selectedDate.getDay() === 1
    ) {
      setError("Selecciona una fecha disponible.");
      return;
    }

    if (!hora || !servicio || !peluqueroId) {
      setError("Selecciona un horario, un servicio y un peluquero.");
      return;
    }

    setIsSubmitting(true);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      navigate("/login", { replace: true });
      return;
    }

    const { data: existingAppointment, error: availabilityError } =
      await supabase
        .from("turnos")
        .select("id")
        .eq("peluquero_id", peluqueroId)
        .eq("fecha", fecha)
        .eq("hora", hora)
        .limit(1)
        .maybeSingle();

    if (availabilityError) {
      setError(availabilityError.message);
      setIsSubmitting(false);
      return;
    }

    if (existingAppointment) {
      setError(
        "Ese horario ya se encuentra reservado para el peluquero seleccionado.",
      );
      setIsSubmitting(false);
      return;
    }

    // Inserta la reserva real en Supabase usando el usuario de la sesión activa.
    const { error: insertError } = await supabase.from("turnos").insert({
      usuario_id: user.id,
      peluquero_id: peluqueroId,
      fecha,
      hora,
      servicio,
      estado: "PENDIENTE",
      precio: 0,
    });

    if (insertError) {
      setError(insertError.message);
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage("Turno reservado correctamente.");
    setTimeout(() => navigate("/my-appointments"), 800);
  };

  if (isCheckingAuth) {
    return <p className="py-8">Cargando...</p>;
  }

  return (
    <main className="min-h-svh bg-muted/30 px-4 py-8 text-left">
      <form className="mx-auto grid w-full max-w-5xl gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="m-0 text-3xl font-bold">Reservar turno</h1>
            <p className="mt-2 text-muted-foreground">
              Elige el momento y el servicio que prefieras.
            </p>
          </div>
          <Button onClick={() => navigate("/my-appointments")} type="button">
            Volver a Mis Turnos
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Selecciona la fecha</CardTitle>
              <CardDescription className="flex items-center justify-between gap-3">
                <Button
                  aria-label="Mes anterior"
                  className="h-9 border bg-transparent px-3 text-foreground hover:bg-muted"
                  disabled={!canGoToPreviousMonth}
                  onClick={() =>
                    setVisibleMonth(
                      new Date(
                        visibleMonth.getFullYear(),
                        visibleMonth.getMonth() - 1,
                        1,
                      ),
                    )
                  }
                  type="button"
                >
                  ← Mes anterior
                </Button>
                <span className="capitalize">{monthTitle}</span>
                <Button
                  aria-label="Mes siguiente"
                  className="h-9 border bg-transparent px-3 text-foreground hover:bg-muted"
                  disabled={!canGoToNextMonth}
                  onClick={() =>
                    setVisibleMonth(
                      new Date(
                        visibleMonth.getFullYear(),
                        visibleMonth.getMonth() + 1,
                        1,
                      ),
                    )
                  }
                  type="button"
                >
                  Mes siguiente →
                </Button>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2 text-center">
                {weekDays.map((day) => (
                  <span className="pb-2 text-xs font-medium text-muted-foreground" key={day}>
                    {day}
                  </span>
                ))}
                {openCalendarDays.map((date) => {
                  const dateValue = formatLocalDate(date);
                  const isOutsideRange = date < today || date > maxDate;
                  const isSelected = fecha === dateValue;

                  return (
                    <Button
                      aria-label={`Seleccionar ${date.toLocaleDateString("es-AR")}`}
                      aria-pressed={isSelected}
                      className={
                        isSelected
                          ? "mx-auto size-10 rounded-full bg-[#00508F] p-0 text-white hover:bg-[#00508F]"
                          : isOutsideRange
                            ? "mx-auto size-10 rounded-full bg-gray-200 p-0 text-gray-500 opacity-100"
                          : "mx-auto size-10 rounded-full bg-[#4F3815] p-0 text-white hover:bg-[#3B2910]"
                      }
                      disabled={isOutsideRange}
                      key={dateValue}
                      onClick={() => setFecha(dateValue)}
                      type="button"
                    >
                      {date.getDate()}
                    </Button>
                  );
                })}
              </div>
              <p className="mt-5 text-sm text-muted-foreground">
                No abrimos domingos ni lunes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selecciona el horario</CardTitle>
              <CardDescription>Horarios disponibles para tu visita.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {hours.map((availableHour) => {
                const isSelected = hora === availableHour;
                return (
                  <Button
                    aria-pressed={isSelected}
                    className={
                      isSelected
                        ? "rounded-full bg-[#00508F] text-white hover:bg-[#00508F]"
                        : "rounded-full bg-[#4F3815] text-white hover:bg-[#3B2910]"
                    }
                    key={availableHour}
                    onClick={() => setHora(availableHour)}
                    type="button"
                  >
                    {availableHour}
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Selecciona el servicio</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {services.map((availableService) => {
              const isSelected = servicio === availableService;
              return (
                <Button
                  aria-pressed={isSelected}
                    className={
                      isSelected
                      ? "h-16 bg-[#00508F] text-base text-white hover:bg-[#00508F]"
                      : "h-16 bg-[#4F3815] text-base text-white hover:bg-[#3B2910]"
                  }
                  key={availableService}
                  onClick={() => setServicio(availableService)}
                  type="button"
                >
                  {availableService}
                </Button>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selecciona el peluquero</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-4">
            {peluqueros.map((peluquero) => {
              const isSelected = peluqueroId === peluquero.id;
              return (
                <Button
                  aria-pressed={isSelected}
                  className={
                    isSelected
                      ? "h-14 bg-[#00508F] text-base text-white hover:bg-[#00508F]"
                      : "h-14 bg-[#4F3815] text-base text-white hover:bg-[#3B2910]"
                  }
                  key={peluquero.id}
                  onClick={() => setPeluqueroId(peluquero.id)}
                  type="button"
                >
                  {peluquero.nombre}
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {successMessage ? (
          <p className="text-sm text-emerald-600">{successMessage}</p>
        ) : null}

        <Button
          className="h-12 w-full text-base"
          disabled={isSubmitting || !fecha || !hora || !servicio || !peluqueroId}
          type="submit"
        >
          {isSubmitting ? "Reservando..." : "Reservar turno"}
        </Button>
      </form>
    </main>
  );
}

export default BookAppointment;
