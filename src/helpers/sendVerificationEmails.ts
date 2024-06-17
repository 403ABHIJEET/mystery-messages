import {resend} from '@/lib/resend'
import VerificationEmail from '../../emails/verificationEmail'
import { ApiResponse } from '@/types/ApiResponse'
import { use } from 'react'

export async function sendVerificationEmails(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verify your email',
            react: VerificationEmail({username, otp: verifyCode})
        })
        return ({
            success: true,
            message: "Verification email sent successfully"
        })
    } catch(error) {
        console.log("Error while sending verification email", error)
        return ({
            success: false,
            message: "Error sending verification email"
        })
    }
}
