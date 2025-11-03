import * as xlsx from "xlsx";

export type ApprovedUserData = {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
};

export function downloadApprovedUsersExcel(data: ApprovedUserData[]) {
  const formattedData = data.map((user, index) => ({
    "#": index + 1,
    DNI: user.dni,
    Nombre: user.firstName,
    Apellido: user.lastName,
    Email: user.email,
    Teléfono: user.telephone,
  }));

  const worksheet = xlsx.utils.json_to_sheet(formattedData);

  worksheet["!cols"] = [
    { wch: 5 },
    { wch: 12 },
    { wch: 25 },
    { wch: 25 },
    { wch: 30 },
    { wch: 15 },
  ];

  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Inscritos Aprobados");

  xlsx.writeFile(workbook, "reporte_inscritos_aprobados.xlsx");
}
