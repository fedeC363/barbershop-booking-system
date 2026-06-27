import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type Appointment = {
  id: string;
  fecha: string;
  hora: string;
  servicio: string;
  estado: string;
};

function MyAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadAppointments = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!isMounted) return;

      if (authError || !user) {
        navigate("/login", { replace: true });
        return;
      }

      const { data, error: appointmentsError } = await supabase
        .from("turnos")
        .select("id, fecha, hora, servicio, estado")
        .eq("usuario_id", user.id);

      if (!isMounted) return;

      if (appointmentsError) {
        setError("No se pudieron cargar tus turnos.");
      } else {
        setAppointments(data ?? []);
      }

      setIsLoading(false);
    };

    void loadAppointments();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <main className="min-h-svh bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="m-0 text-3xl font-bold">Mis Turnos</h1>
          <Button onClick={() => navigate("/book-appointment")}>
            Reservar nuevo turno
          </Button>
        </div>

        {isLoading ? <p>Cargando turnos...</p> : null}
        {error ? <p className="text-destructive">{error}</p> : null}

        {!isLoading && !error && appointments.length === 0 ? (
          <p>No tienes turnos registrados.</p>
        ) : null}

        {!isLoading && !error && appointments.length > 0 ? (
          <div className="grid gap-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <CardTitle>{appointment.servicio}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm">
                  <p>
                    <span className="font-medium">Fecha:</span>{" "}
                    {appointment.fecha}
                  </p>
                  <p>
                    <span className="font-medium">Hora:</span>{" "}
                    {appointment.hora}
                  </p>
                  <p>
                    <span className="font-medium">Servicio:</span>{" "}
                    {appointment.servicio}
                  </p>
                  <p>
                    <span className="font-medium">Estado:</span>{" "}
                    {appointment.estado}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default MyAppointments;
