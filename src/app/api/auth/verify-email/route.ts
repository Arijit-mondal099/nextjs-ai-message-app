import { dbConnection } from "@/lib/dbConnect"
import { verifySchema } from "@/schemas/verify.schema"
import { NextRequest, NextResponse } from "next/server"
import User from "@/models/User.model"
import { z } from "zod"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const validation = verifySchema.safeParse(body)

        if (!validation.success) {
            const error = z.treeifyError(validation.error)
            return NextResponse.json(
                { success: false, message: "Invalid OTP", error },
                { status: 400 }
            )
        }

        const { token, username } = validation.data

        await dbConnection()
        const user = await User.findOne({ username })

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Oops user not found" },
                { status: 400 }
            )
        }

        if (user.isVerified) {
            return NextResponse.json(
                { success: false, message: "Oops account alredy verified try to signin"},
                { status: 400 }
            )
        }

        const isValidCode = token === user.verifyCode
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (!isCodeNotExpired) {
            return NextResponse.json(
                { success: false, message: "OTP expired, please request a new one"},
                { status: 400 }
            )
        }
        
        if (!isValidCode) {
            return NextResponse.json(
                { success: false, message: "Oops invalid OTP"},
                { status: 400 }
            )
        }

        user.isVerified = true
        await user.save()
        
        return NextResponse.json(
            { success: true, message: "Account verified successfully" },
            { status: 200 }
        )
    } catch (error: unknown) {
        console.error("Error from verify email", error)
        return NextResponse.json(
            { success: false, message: "faild to check username" },
            { status: 500 }
        )
    }
}