import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import User from "@/models/User.model"
import { dbConnection } from "@/lib/dbConnect";


export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        const user = session?.user

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized request" },
                { status: 401 }
            )
        }

        const userId = user._id
        const { acceptMessage } = await request.json()

        await dbConnection()

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessage },
            { new: true }
        )

        if (!updatedUser) {
            return NextResponse.json(
                { success: false, message: "Faild to update user message status" },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { success: true, message: "User message status updated", data: { ...updatedUser, password: undefined } },
            { status: 200 }
        )
    } catch (error: unknown) {
        console.error("Error from update accepting messages", error)
        return NextResponse.json(
            { success: false, message: "Internal server error please try again latter" },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        const user = session?.user

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized request" },
                { status: 401 }
            )
        }

        const userId = user._id

        await dbConnection()

        const findUser = await User.findById(userId)

        if (!findUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            )
        }        

        return NextResponse.json(
            { success: true, message: "success", isAcceptingMessage: findUser.isAcceptingMessage },
            { status: 404 }
        )
    } catch (error: unknown) {
        console.error("Error from get accepting messages", error)
        return NextResponse.json(
            { success: false, message: "Internal server error please try again latter" },
            { status: 500 }
        )
    }
}
