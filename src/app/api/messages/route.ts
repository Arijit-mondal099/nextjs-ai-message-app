import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import User, { Message } from "@/models/User.model"
import { dbConnection } from "@/lib/dbConnect";
import mongoose from "mongoose";
import UserModel from "@/models/User.model";

/**
 * Get all user messages
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized request" },
        { status: 401 },
      );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    await dbConnection()

    // After $unwind + $sort, each document in the pipeline is a single message with its parent user's _id
    // The $group stage re-assembles them back into one document per user
    const foundUser = await User.aggregate([
        { $match: { _id: userId } },
        { $unwind: "$messages" },
        { $sort: { "messages.createdAt": -1 } },
        { $group: { _id: "$_id", messages: { $push: "$messages" } } }
    ])

    if (!foundUser || foundUser.length === 0) {
      return NextResponse.json(
        { success: false, message: "Look like you haven;t got any feedback message" },
        { status: 401 },
      );
    }

    return NextResponse.json(
        { success: true, message: "success", data: foundUser[0].messages },
        { status: 200 }
    )
  } catch (error: unknown) {
    console.error("Error from get messages", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error please try again latter",
      },
      { status: 500 },
    );
  }
}

/*
* Create message
*/
export async function POST(request: NextRequest) {
    await dbConnection()
    const { username, message } = await request.json() as { username: string, message: string }

    if (!username?.trim() || !message?.trim()) {
        return NextResponse.json(
            { success: false, message: `${!username?.trim() ? "Username not provided" : "Message not provided"}` },
            { status: 400 }
        )
    }
    
    try {
        const user = await UserModel.findOne({ username })

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            )
        }

        if (!user.isAcceptingMessage) {
            return NextResponse.json(
                { success: false, message: "User not accepting messages" },
                { status: 403 }
            )
        }

        const newMessage = {
            content: message,
            createdAt: new Date()
        } as Message

        user.messages.push(newMessage)
        await user.save()

        return NextResponse.json(
            { success: true, message: "Message send successfully", data: newMessage },
            { status: 200 }
        )
    } catch (error: unknown) {
        console.error("Error from post messages", error);
            return NextResponse.json(
            {
                success: false,
                message: "Internal server error please try again latter",
            },
            { status: 500 },
        );
    }
}
