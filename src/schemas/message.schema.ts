import { z } from "zod"

export const messageSchema = z.object({
    content: 
        z.string()
        .min(1, { message: "Message has to 1 characters" })
        .max(1000, { message: "Message has to under 1000 characters" })
})

export type MessageSchemaData = z.infer<typeof messageSchema>
