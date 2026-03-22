import { resend } from "@/lib/resend"
import { VerificationEmailTemplate } from "../../emails/verification-email-template"
import { ApiResponse } from "@/types/apiResponse"
import User from "@/models/User.model"

export async function sendVerificationEmail(
    email: string,
    username: string,
    verificationCode: string
): Promise<ApiResponse<undefined>> {
    try {
        const user = await User.find({ email })

        if (!user) {
            return {
                success: false,
                message: "Opps user not found with credintails"
            }
        }

        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: "Verification Code",
            react: VerificationEmailTemplate({ username, verificationCode })
        })

        return {
            success: true,
            message: "Verification email sent successfully"
        }
    } catch (error: unknown) {
        console.error("Error from sending verification email", error)
        return {
            success: false,
            message: "Faild to sent Verification email!"
        }
    }
}

