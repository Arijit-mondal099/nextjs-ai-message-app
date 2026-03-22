import { z } from "zod"

export const signupSchema = z.object({
    username: 
        z.string()
        .min(4, { message: "Username has to 4 characters" })
        .max(30, { message: "Username has to under 30 characters" })
        .regex(/^[a-zA-Z0-9_]+$/, "No special characters allowed"),
    email: 
        z.email()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Please provided an valid email" }),
    password:
        z.string()
        .min(8, { message: "Password has to 4 characters" })
        .max(18, { message: "Password has to under 30 characters" })
})

export type SignupData = z.infer<typeof signupSchema>
