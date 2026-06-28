type AppointmentStatusBadgeProps = {
  status: string;
};

const statusStyles = {
  PENDIENTE: {
    label: "Pendiente",
    className: "bg-yellow-100 text-yellow-950",
  },
  CONFIRMADO: {
    label: "Confirmado",
    className: "bg-green-100 text-green-950",
  },
  FINALIZADO: {
    label: "Confirmado",
    className: "bg-green-100 text-green-950",
  },
  CANCELADO: {
    label: "Cancelado",
    className: "bg-red-100 text-red-950",
  },
} as const;

function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  const displayStatus = statusStyles[status as keyof typeof statusStyles];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        displayStatus?.className ?? "bg-muted text-foreground"
      }`}
    >
      {displayStatus?.label ?? status}
    </span>
  );
}

export default AppointmentStatusBadge;
