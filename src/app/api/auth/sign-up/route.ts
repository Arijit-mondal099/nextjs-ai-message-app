import { NextRequest, NextResponse } from "next/server"
import User from "@/models/User.model"
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"
import { dbConnection } from "@/lib/dbConnect"
import { signupSchema } from "@/schemas/signup.schema"
import { z } from "zod"


export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const validation = signupSchema.safeParse(body)

        if (!validation.success) {
            const error = z.treeifyError(validation.error)
            return NextResponse.json(
                { success: false, message: "Validation failed", error },
                { status: 400 }
            )
        }

        const { email, password, username } = validation.data

        await dbConnection()

        const isUserExistWithUsername = await User.findOne({ username })

        if (isUserExistWithUsername) {
            return NextResponse.json(
                { success: false, message: "Oops username already used" },
                { status: 400 }
            )
        }

        const isUserExistWithEmail = await User.findOne({ email })

        const hashPassword = await bcrypt.hash(password, 10)
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const verifyCodeExpiry = Date.now() + 600000
        let emailResult: { success: boolean, message: string } | undefined;

        if (isUserExistWithEmail && isUserExistWithEmail.isVerified) {
            return NextResponse.json(
                { success: false, message: "Oops account already verified" },
                { status: 400 }
            )
        } else if (isUserExistWithEmail && !isUserExistWithEmail.isVerified) {
            await User.updateOne({ email }, { verifyCode, verifyCodeExpiry, password: hashPassword })
            emailResult = await sendVerificationEmail(email, username, verifyCode)
        } else {
            await User.create({
                username,
                email,
                password: hashPassword,
                verifyCode,
                verifyCodeExpiry
            })

            emailResult = await sendVerificationEmail(email, username, verifyCode)
        }

        if (!emailResult.success) {
            return NextResponse.json(
                { success: false, message: emailResult.message },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { success: true, message: "Verification email sent successfully" },
            { status: isUserExistWithEmail ? 200 : 201 }
        )
    } catch (error: unknown) {
        console.error("Error form signup", error)
        return NextResponse.json(
            { success: false, message: "Failed to sign up please try again!" },
            { status: 500 }
        )
    }
}
