import { z } from "zod"

export const signinSchema = {
    indentifier: z.string(),
    password: z.string()
}

export type SignupSchemaData = z.infer<typeof signinSchema>
