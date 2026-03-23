import { z } from 'zod'
import { usernameSchema } from './signup.schema'

export const verifySchema = z.object({
    token:
        z.string()
        .length(6, "OTP must be 6 digits")
        .regex(/^\d+$/, "OTP must contain only numbers"),
    username: usernameSchema
})

export type VerifySchemaData = z.infer<typeof verifySchema>
