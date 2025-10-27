import nodemailer from "nodemailer"
import { ENV } from "../config/env"

const transporter = nodemailer.createTransport({
    host: ENV.EMAIL_HOST,
    port: 587,
    auth: {
        user: ENV.EMAIL_ADDRESS,
        pass: ENV.EMAIL_PASSWORD
    }
})

interface Email {
    to: string,
    subject: string,
    text: string,
    html?: string
}

export const sendMail = async({to, subject, text, html}: Email) => {
    const info = await transporter.sendMail({
        from: `USM ${ENV.EMAIL_ADDRESS}`,
        to,
        subject,
        text,
        html
    })
    console.log(`Message sent to ${to}: ${info.messageId}`)
    return info
}