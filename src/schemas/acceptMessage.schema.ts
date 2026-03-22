import { z } from "zod"

export const acceptMsgSchema = z.object({
    accept: z.boolean()
})

export type AcceptMsgSchemaData = z.infer<typeof acceptMsgSchema>
