import { z } from "zod"

export const signupSchema = z.object({
    username: 
        z.string()
        .min(4, { message: "Username must be at least 4 characters" })
        .max(30, { message: "Username must be under 30 characters" })
        .regex(/^[a-zA-Z0-9_]+$/, "No special characters allowed"),
    email: z.email(),
    password:
        z.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .max(18, { message: "Password must be under 18 characters" })
})

export type SignupData = z.infer<typeof signupSchema>
