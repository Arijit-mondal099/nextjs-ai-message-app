import { z } from 'zod'

export const verifySchema = {
    token:
        z.string()
        .length(6, "OTP must be 6 digits")
        .regex(/^\d+$/, "OTP must contain only numbers"),
}

export type VerifySchemaData = z.infer<typeof verifySchema>
