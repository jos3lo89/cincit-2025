import { PrismaClient, Role } from "@prisma/client";
import { passwordHashed } from "@/lib/bcrypt";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function userRegister() {
  await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      dni: faker.string.numeric(8),
      password: await passwordHashed("admin@admin.com"),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: "admin@admin.com",
      telephone: faker.string.numeric(9),
      institution: "UNAJMA",
      role: Role.ADMINISTRATOR,
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
