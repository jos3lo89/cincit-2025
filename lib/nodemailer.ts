"use server";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


export const sendOtp = async (to: string, otp: string) => {
  const mailOptions = {
    from: '"CINCIT 2025" <noreply@cincit.com>',
    to,
    subject: "Tu código de verificación de CINCIT",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
        <h2>Verificación de Correo Electrónico</h2>
        <p>Usa el siguiente código para completar tu registro. El código es válido por 15 minutos.</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; background-color: #f0f0f0; padding: 10px 20px; border-radius: 5px; display: inline-block;">
          ${otp}
        </p>
        <p style="font-size: 12px; color: #777;">Si no solicitaste este código, puedes ignorar este correo.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
