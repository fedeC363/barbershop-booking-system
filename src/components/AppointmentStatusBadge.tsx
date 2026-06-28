type AppointmentStatusBadgeProps = {
  status: string;
};

const statusStyles = {
  PENDIENTE: {
    label: "Pendiente",
    className: "border border-[#4F3815] bg-[#FFCD82] text-[#14293A]",
  },
  CONFIRMADO: {
    label: "Confirmado",
    className: "bg-green-600 text-white",
  },
  FINALIZADO: {
    label: "Confirmado",
    className: "bg-green-600 text-white",
  },
  CANCELADO: {
    label: "Cancelado",
    className: "bg-red-600 text-white",
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
