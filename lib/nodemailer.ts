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

export const sendApprovalNotification = async (to: string, name: string) => {
  const mailOptions = {
    from: '"CINCIT 2025" <noreply@cincit.com>',
    to,
    subject: "¡Inscripción Aprobada! Bienvenido a CINCIT 2025",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333; line-height: 1.6;">
        <h2 style="color: #004a99; text-align: center;">¡Bienvenido a CINCIT 2025!</h2>
        <p>Hola <strong>${name}</strong>,</p>
        <p>¡Muchas gracias por inscribirte! Nos complace confirmar que tu inscripción para el <strong>CINCIT 2025</strong> ha sido aprobada.</p>
        <p>Estamos emocionados de contar con tu participación.</p>
        
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h3 style="margin-top: 0;">Detalles del Evento</h3>
          <p>Recuerda que el evento se llevará a cabo:</p>
          <p style="font-size: 18px; font-weight: bold;">Del 10 al 13 de Noviembre</p> 
        </div>

        <div style="text-align: center; margin-top: 25px;">
          <h3 style="margin-bottom: 15px;">¡Conéctate con nosotros!</h3>
          <p style="font-size: 14px; color: #555;">No te pierdas ninguna actualización y síguenos en nuestras redes sociales:</p>
          <div style="margin-top: 20px;">
            <a href="https://www.cincit.com" style="display: inline-block; margin: 5px 10px; padding: 10px 15px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">
              Página Web
            </a>
            <a href="https://www.facebook.com/CINCIT25" style="display: inline-block; margin: 5px 10px; padding: 10px 15px; background-color: #3b5998; color: #ffffff; text-decoration: none; border-radius: 5px;">
              Facebook
            </a>
            <a href="https://www.tiktok.com/@cincit.unajma" style="display: inline-block; margin: 5px 10px; padding: 10px 15px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 5px;">
              TikTok
            </a>
          </div>
        </div>
        
        <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #777;">
          Nos vemos pronto,<br>
          El equipo organizador de CINCIT 2025
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
