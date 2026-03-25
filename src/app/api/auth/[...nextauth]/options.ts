import { dbConnection } from "@/lib/dbConnect"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import User from "@/models/User.model"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                identifier: { label: "Email or Username", type: "text", placeholder: "email or username" },
                password: { label: "Password", type: "password" }
            },
            async authorize(
                credentials: Record<"identifier" | "password", string> | undefined,
                req
            ): Promise<any> {
                try {
                    if (!credentials?.identifier || !credentials?.password) {
                        throw new Error("Missing credentials")
                    }

                    await dbConnection()

                    const { identifier, password } = credentials

                    const user = await User.findOne({ 
                        $or: [{ email: identifier }, { username: identifier }] 
                    })
                    
                    if (!user) throw new Error("User not found")
                    if (!user.isVerified) throw new Error("Please verify your account")

                    const isValidPassword = await bcrypt.compare(password, user.password)
                    if (!isValidPassword) throw new Error("Oops invalid credentials")

                    return user
                } catch (error: unknown) {
                    console.error(error)
                    throw new Error(error instanceof Error ? error.message : "Faild to login via Credentials")
                } 
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username
            }

            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id
                token.isVerified = user.isVerified
                token.isAcceptingMessage = user.isAcceptingMessage
                token.username = user.username
            }

            return token
        }
    },
    pages: { 
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}
