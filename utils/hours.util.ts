type FormatMode = "date" | "datetime" | "time";

export const formatDatePe = (
  date: string | Date,
  mode: FormatMode = "datetime"
) => {
  const d = typeof date === "string" ? new Date(date) : date;

  if (mode === "date") {
    return new Intl.DateTimeFormat("es-PE", {
      dateStyle: "short",
      timeZone: "America/Lima",
    }).format(d);
  }

  if (mode === "time") {
    return new Intl.DateTimeFormat("es-PE", {
      timeStyle: "medium",
      timeZone: "America/Lima",
    }).format(d);
  }

  // default: datetime
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "America/Lima",
  }).format(d);
};
