import { PrismaClient, Role } from "@prisma/client";
import { passwordHashed } from "@/lib/bcrypt";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function userRegister() {
  // Crear usuario administrador 1
  await prisma.user.upsert({
    where: { email: "admin1@cincit.com" },
    update: {},
    create: {
      dni: faker.string.numeric(8),
      password: await passwordHashed("admin321"),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: "admin1@admin.com",
      telephone: faker.string.numeric(9),
      institution: "UNAJMA",
      role: Role.ADMINISTRATOR,
    },
  });

  // Crear usuario administrador 2
  await prisma.user.upsert({
    where: { email: "admin2@cincit.com" },
    update: {},
    create: {
      dni: faker.string.numeric(8),
      password: await passwordHashed("admin321"),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: "admin2@admin.com",
      telephone: faker.string.numeric(9),
      institution: "UNAJMA",
      role: Role.ADMINISTRATOR,
    },
  });

  // Crear usuario inscriptor
  await prisma.user.upsert({
    where: { email: "inscriptor1@cincit.com" },
    update: {},
    create: {
      dni: faker.string.numeric(8),
      password: await passwordHashed("inscriptor321"),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: "inscriptor1@inscriptor.com",
      telephone: faker.string.numeric(9),
      institution: "UNAJMA",
      role: Role.INSCRIBER,
    },
  });

  // Crear usuario inscriptor 2
  await prisma.user.upsert({
    where: { email: "inscriptor2@cincit.com" },
    update: {},
    create: {
      dni: faker.string.numeric(8),
      password: await passwordHashed("inscriptor321"),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: "inscriptor2@inscriptor.com",
      telephone: faker.string.numeric(9),
      institution: "UNAJMA",
      role: Role.INSCRIBER,
    },
  });
}

async function main() {
  console.log("¡Seeding inicializado con éxito!");
  await userRegister();
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
