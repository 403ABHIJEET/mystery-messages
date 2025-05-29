import { sendVerificationEmails } from "@/helpers/sendVerificationEmails";
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    await dbConnect()
    try {
        const { identifier } = await req.json()
        const user = await UserModel.findOne({
            $or: [
                { email: identifier },
                { username: identifier },
            ]
        })
        if (user) {
            const verifyCode = Math.floor(100000 + Math.random() * 90000).toString()
            user.verifyCode = verifyCode
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            user.verifyCodeExpiry = expiryDate
            await user.save()
            const emailResponse = await sendVerificationEmails(
                user.email,
                user.username,
                verifyCode
            )
            if (!emailResponse.success) {
                return Response.json({
                    success: false,
                    message: "Failed to send email"
                }, { status: 400 })
            }
            return Response.json({
                success: true,
                message: "Email sent successfully",
                username: user.username
            }, { status: 200 })
        }
        return Response.json({
            success: false,
            message: "Username or email doesn't exist"
        }, {status: 404})
    } catch (error) {
        console.log("Something went wrong", error)
        return Response.json({
            success: false,
            message: "something went wrong"
        }, {status: 500})
    }
}