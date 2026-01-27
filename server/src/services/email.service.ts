import {
  resendMailTransporter,
  mailtrapMailTransportter,
} from "./mail.service.js";
import { SendEmailParams } from "../types/data.js";

export const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
  const emailProvider =
    process.env.EMAIL_PROVIDER === "resend"
      ? resendMailTransporter
      : mailtrapMailTransportter;
      
  await emailProvider.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  });
};
