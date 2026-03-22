
import { Document, Schema } from "mongoose"

export interface Message extends Document {
    content: string;
}

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isAppcetingMessage: boolean;
    messages: Message[]
}

const messageSchema: Schema<Message> = new Schema(
    {
        content: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
        }
    },
    {
        timestamps: true
    }
)

const userSchema: Schema<User> = new Schema(
    {
        username: {
            type: String,
            trim: true,
            required: [true, "Username is required"]
        }
    }
)

