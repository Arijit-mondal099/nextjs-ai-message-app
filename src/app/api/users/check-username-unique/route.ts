import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User.model"
import { z } from "zod"
import { usernameSchema } from "@/schemas/signup.schema";
import { dbConnection } from "@/lib/dbConnect";

const usernameQueryScgema = z.object({
    username: usernameSchema
})


export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        
        const queryParams = {
            username: searchParams.get("q")
        }

        const vaidation = usernameQueryScgema.safeParse(queryParams)

        if (!vaidation.success) {
            const error = z.treeifyError(vaidation.error)
            return NextResponse.json(
                { success: false, message: "Validation faild", error },
                { status: 400 }
            )
        }

        const { username } = vaidation.data

        await dbConnection()
        const isUsernameExist = await User.findOne({ username, isVerified: true })

        if (isUsernameExist) {
            return NextResponse.json(
                { success: false, message: "Username alredy exist!" },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { success: true, message: "Valid and unique username" },
            { status: 200 }
        )
    } catch (error: unknown) {
        console.error("Error from checking username unique", error)
        return NextResponse.json(
            { success: false, message: "faild to check username" },
            { status: 500 }
        )
    }
}
