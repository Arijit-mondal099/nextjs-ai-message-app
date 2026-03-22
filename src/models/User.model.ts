
import { Document, Model, model, models, Schema } from "mongoose"

export interface Message extends Document {
    content: string;
}

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isAcceptingMessage: boolean;
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
            required: [true, "Username is required"],
            unique: [true, "Username alredy taken"],
            maxLength: [30, "Username can't be 30 charaters long"]
        },
        email: {
            type: String,
            trim: true,
            required: [true, "Email is required"],
            unique: [true, "Email alredy taken"],
            lowercase: true
        },
        password: {
            type: String,
            trim: true,
            required: [true, "Password is required"]
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        verifyCode: {
            type: String,
            required: [true, "Verify code is required"]
        },
        verifyCodeExpiry: {
            type: Date,
            required: [true, "Verify code expiry is required"]
        },
        isAcceptingMessage: {
            type: Boolean,
            default: true
        },
        messages: [messageSchema]
    },
    {
        timestamps: true
    }
)


export default (models.User as Model<User>) || model<User>("User", userSchema)
