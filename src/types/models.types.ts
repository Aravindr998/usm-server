export interface OtpSchema {
    otp: string,
    purpose: "signup" | "login" | "password_reset",
    email: string,
}