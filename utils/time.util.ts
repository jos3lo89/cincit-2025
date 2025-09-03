export const formatDate = (
  dateString: string,
  format: "long" | "slash" | "dash" = "long"
) => {
  const date = new Date(dateString);

  switch (format) {
    case "slash":
      // 17/09/2025
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

    case "dash":
      // 17-09-2025
      return date
        .toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replaceAll("/", " - ");

    case "long":
    default:
      // 17 de septiembre de 2025
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
  }
};
