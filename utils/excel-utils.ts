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

export type AttendanceReportData = {
  dni: string;
  firstName: string;
  lastName: string;
  telephone: string;
  institution: string;
  voucherCode: string | null;
  [key: string]: any;
};

export function downloadAttendanceReportExcel(data: AttendanceReportData[]) {
  const formattedData = data.map((row, index) => ({
    "#": index + 1,
    Nombres: row.firstName,
    Apellidos: row.lastName,
    DNI: row.dni,
    Celular: row.telephone,
    Institución: row.institution,
    "Cod. Voucher": row.voucherCode,
    "Entrada 10/11/25": row.entry_2025_11_10,
    "Salida 10/11/25": row.exit_2025_11_10,
    "Entrada 11/11/25": row.entry_2025_11_11,
    "Salida 11/11/25": row.exit_2025_11_11,
    "Entrada 12/11/25": row.entry_2025_11_12,
    "Salida 12/11/25": row.exit_2025_11_12,
    "Entrada 13/11/25": row.entry_2025_11_13,
    "Salida 13/11/25": row.exit_2025_11_13,
  }));

  const worksheet = xlsx.utils.json_to_sheet(formattedData);

  worksheet["!cols"] = [
    { wch: 5 },
    { wch: 25 },
    { wch: 25 },
    { wch: 12 },
    { wch: 15 },
    { wch: 30 },
    { wch: 15 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
  ];

  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Reporte de Asistencia");

  xlsx.writeFile(workbook, "reporte_asistencia_total.xlsx");
}
