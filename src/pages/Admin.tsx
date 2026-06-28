import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type RelatedUser = {
  nombre: string;
  apellido: string;
};

type RelatedBarber = {
  nombre: string;
};

type Appointment = {
  id: string;
  fecha: string;
  hora: string;
  servicio: string;
  estado: string;
  usuarios: RelatedUser | RelatedUser[] | null;
  peluqueros: RelatedBarber | RelatedBarber[] | null;
};

function getRelation<T>(relation: T | T[] | null) {
  return Array.isArray(relation) ? relation[0] ?? null : relation;
}

function Admin() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState<string | null>(
    null,
  );
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadAppointments = async () => {
      setIsLoading(true);
      setError("");

      const { data, error: appointmentsError } = await supabase
        .from("turnos")
        .select(
          "id, fecha, hora, servicio, estado, usuarios(nombre, apellido), peluqueros(nombre)",
        )
        .order("fecha", { ascending: true })
        .order("hora", { ascending: true });

      if (!isMounted) return;

      if (appointmentsError) {
        setError("No se pudieron cargar los turnos.");
      } else {
        setAppointments(data ?? []);
      }

      setIsLoading(false);
    };

    void loadAppointments();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const updateAppointmentStatus = async (appointmentId: string, estado: string) => {
    setError("");
    setUpdatingAppointmentId(appointmentId);

    const { error: updateError } = await supabase
      .from("turnos")
      .update({ estado })
      .eq("id", appointmentId);

    if (updateError) {
      setError("No se pudo actualizar el estado del turno.");
    } else {
      setRefreshKey((currentKey) => currentKey + 1);
    }

    setUpdatingAppointmentId(null);
  };

  return (
    <main className="min-h-svh bg-muted/30 px-4 py-8 text-left">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
          <h1 className="m-0 text-3xl font-bold">Panel de administración</h1>
          <p className="mt-2 text-muted-foreground">
            Todos los turnos registrados en Trimly.
          </p>
          </div>
          <Button onClick={() => navigate("/my-appointments")}>
            Volver a Mis Turnos
          </Button>
        </div>

        {isLoading ? <p>Cargando turnos...</p> : null}
        {error ? <p className="text-destructive">{error}</p> : null}

        {!isLoading && !error && appointments.length === 0 ? (
          <p>No hay turnos registrados.</p>
        ) : null}

        {!isLoading && appointments.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Turnos</CardTitle>
              <CardDescription>
                {appointments.length}{" "}
                {appointments.length === 1 ? "turno registrado" : "turnos registrados"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-3xl border-collapse text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="px-4 py-3 font-medium">Cliente</th>
                      <th className="px-4 py-3 font-medium">Peluquero</th>
                      <th className="px-4 py-3 font-medium">Fecha</th>
                      <th className="px-4 py-3 font-medium">Hora</th>
                      <th className="px-4 py-3 font-medium">Servicio</th>
                      <th className="px-4 py-3 font-medium">Estado</th>
                      <th className="px-4 py-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => {
                      const client = getRelation(appointment.usuarios);
                      const barber = getRelation(appointment.peluqueros);

                      return (
                        <tr className="border-b last:border-0" key={appointment.id}>
                          <td className="px-4 py-3">
                            {client
                              ? `${client.nombre} ${client.apellido}`
                              : "Sin cliente"}
                          </td>
                          <td className="px-4 py-3">
                            {barber?.nombre ?? "Sin asignar"}
                          </td>
                          <td className="px-4 py-3">{appointment.fecha}</td>
                          <td className="px-4 py-3">{appointment.hora}</td>
                          <td className="px-4 py-3">{appointment.servicio}</td>
                          <td className="px-4 py-3">{appointment.estado}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              {appointment.estado === "PENDIENTE" ? (
                                <Button
                                  disabled={updatingAppointmentId === appointment.id}
                                  onClick={() =>
                                    void updateAppointmentStatus(
                                      appointment.id,
                                      "CONFIRMADO",
                                    )
                                  }
                                >
                                  Confirmar
                                </Button>
                              ) : null}

                              {appointment.estado === "CONFIRMADO" ? (
                                <Button
                                  disabled={updatingAppointmentId === appointment.id}
                                  onClick={() =>
                                    void updateAppointmentStatus(
                                      appointment.id,
                                      "FINALIZADO",
                                    )
                                  }
                                >
                                  Finalizar
                                </Button>
                              ) : null}

                              {appointment.estado === "PENDIENTE" ||
                              appointment.estado === "CONFIRMADO" ? (
                                <Button
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={updatingAppointmentId === appointment.id}
                                  onClick={() =>
                                    void updateAppointmentStatus(
                                      appointment.id,
                                      "CANCELADO",
                                    )
                                  }
                                >
                                  Cancelar
                                </Button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </main>
  );
}

export default Admin;
