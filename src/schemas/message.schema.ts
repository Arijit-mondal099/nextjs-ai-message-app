import { z } from "zod"

export const messageSchema = z.object({
    message: 
        z.string()
        .min(1, { message: "Message has to 2 characters" })
        .max(1000, { message: "Message has to under 1000 characters" })
})

export type MessageSchemaData = z.infer<typeof messageSchema>
