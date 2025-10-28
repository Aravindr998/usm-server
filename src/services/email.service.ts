import nodemailer from "nodemailer"
import { ENV } from "../config/env"
import { logger } from "../utils/logger";

const transporter = nodemailer.createTransport({
    host: ENV.EMAIL_HOST,
    port: 587,
    auth: {
        user: ENV.EMAIL_ADDRESS,
        pass: ENV.EMAIL_PASSWORD
    },
    pool: true
})

transporter.verify((error, success) => {
  if (error) console.error("SMTP connection error:", error);
  else logger.info("SMTP server ready to send emails.");
});

interface Email {
    to: string,
    subject: string,
    text: string,
    html?: string
}

export const sendMail = async({to, subject, text, html}: Email) => {
    try {
        const info = await transporter.sendMail({
            from: `"USM" <${ENV.EMAIL_ADDRESS}>`,
            to,
            subject,
            text,
            html
        })
        logger.success(`Message sent to ${to}: ${info.messageId}`)
        return info
    } catch (error) {
        logger.error(`Failed to send mail to ${to}:`, error);
        throw new Error("Email sending failed");
    }
}