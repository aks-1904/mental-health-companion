import nodemailer from "nodemailer";

export const resendMailTransporter = nodemailer.createTransport({
  host: process.env.RESEND_HOST,
  port: Number(process.env.RESEND_PORT),
  auth: {
    user: process.env.RESEND_USER,
    pass: process.env.RESEND_API_KEY,
  },
});

export const mailtrapMailTransportter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MMMAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});
