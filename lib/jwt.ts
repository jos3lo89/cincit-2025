import jwt from "jsonwebtoken";

export const generateToken = <T extends Record<string, any>>(
  payload: T
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
      (error, token) => {
        if (error || !token) {
          console.error("Error al generar el token JWT:", error);
          return reject(error);
        }
        resolve(token);
      }
    );
  });
};

export const verifyToken = <T>(token: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, decodedPayload) => {
      if (error) {
        return reject(error);
      }
      if (decodedPayload) {
        resolve(decodedPayload as T);
      } else {
        reject(new Error("El payload decodificado del JWT es inválido."));
      }
    });
  });
};
