import bcrypt from "bcryptjs";

export const passwordHashed = async (pass: string) => {
  return await bcrypt.hash(pass, 12);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};
