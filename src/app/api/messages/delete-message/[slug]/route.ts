import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { dbConnection } from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/User.model";
import mongoose from "mongoose";

type Params = {
    params: Promise<{ slug: string }>
}

export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const { slug } = await params
        const session = await getServerSession(authOptions)
        const user = session?.user as User

        if (!session || !session?.user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized request" },
                { status: 401 }
            )
        }

        await dbConnection()

        const res = await UserModel.updateOne(
            { _id: new mongoose.Types.ObjectId(user._id)},
            { $pull: { messages: { _id: new mongoose.Types.ObjectId(slug) } } },
        )

        if (res.modifiedCount === 0) {
            return NextResponse.json(
                { success: false, message: "Message not found" },
                { status: 404 }
            )
        }
        
        return NextResponse.json(
            { success: true, message: "Message deleted successfully" },
            { status: 200 }
        )
    } catch (error: unknown) {
        console.error("Error from get messages", error);
        return NextResponse.json(
            {
            success: false,
            message: "Internal server error please try again latter",
            },
            { status: 500}
        )
    }
}
