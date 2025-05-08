import * as z from "zod"

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
  email: z.string().email("Invalid email address"),
})

export type VerifyOtpSchema = z.infer<typeof verifyOtpSchema> 