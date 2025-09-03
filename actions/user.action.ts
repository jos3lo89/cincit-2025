"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const getProfile = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    redirect("/signin");
  }

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};
