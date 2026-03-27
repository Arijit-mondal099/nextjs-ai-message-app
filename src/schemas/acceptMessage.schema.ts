import { z } from "zod"

export const acceptMsgSchema = z.object({
    acceptMessage: z.boolean()
})

export type AcceptMsgSchemaData = z.infer<typeof acceptMsgSchema>
