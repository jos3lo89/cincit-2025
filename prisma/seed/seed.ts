import {
  AttendanceState,
  AttendanceType,
  CincitEdition,
  PrismaClient,
  Role,
} from "@/app/generated/prisma";
import { passwordHashed } from "@/lib/bcrypt";

import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

function getAttendanceDates(): Date[] {
  const simpleEventDates = [
    "2025-09-16 08:00", // evento a las 8:00 AM
    "2025-09-17 08:00", // evento a las 8:00 AM
    "2025-09-18 08:00", // evento a las 8:00 AM
  ];

  return simpleEventDates.map((dateStr) => {
    const isoDateStr = `${dateStr.replace(" ", "T")}:00-05:00`;
    return new Date(isoDateStr);
  });
}

async function userRegister() {
  await prisma.user.upsert({
    where: { email: "evilain999@gmail.com" },
    update: {},
    create: {
      dni: "12345678",
      password: await passwordHashed("12345678"),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: "evilain999@gmail.com",
      telephone: faker.string.numeric(9),
      institution: "UNAJMA",
      role: Role.ADMINISTRATOR,
    },
  });
}

async function attendanceCreate() {
  const [monday, tuesday, wednesday] = getAttendanceDates();

  await prisma.attendance.createMany({
    data: [
      {
        date: monday,
        cincitEdition: CincitEdition.E2025,
        attendanceType: AttendanceType.entrance,
        attendanceState: AttendanceState.visible,
      },
      {
        date: monday,
        cincitEdition: CincitEdition.E2025,
        attendanceType: AttendanceType.exit,
        attendanceState: AttendanceState.hidden,
      },
      {
        date: tuesday,
        cincitEdition: CincitEdition.E2025,
        attendanceType: AttendanceType.entrance,
        attendanceState: AttendanceState.hidden,
      },
      {
        date: tuesday,
        cincitEdition: CincitEdition.E2025,
        attendanceType: AttendanceType.exit,
        attendanceState: AttendanceState.hidden,
      },
      {
        date: wednesday,
        cincitEdition: CincitEdition.E2025,
        attendanceType: AttendanceType.entrance,
        attendanceState: AttendanceState.hidden,
      },
      {
        date: wednesday,
        cincitEdition: CincitEdition.E2025,
        attendanceType: AttendanceType.exit,
        attendanceState: AttendanceState.hidden,
      },
    ],
  });
}

async function main() {
  console.log("¡Seeding inicializado con éxito!");
  await userRegister();
  await attendanceCreate();
  console.log("¡Seeding finalizado con éxito!");
}

main()
  .catch((e) => {
    console.error("Ocurrió un error durante el seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
