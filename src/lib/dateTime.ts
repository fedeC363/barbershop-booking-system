function formatDate(date: string) {
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${year}`;
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":");

  if (!hours || !minutes) {
    return time;
  }

  return `${hours}:${minutes}`;
}

export { formatDate, formatTime };
