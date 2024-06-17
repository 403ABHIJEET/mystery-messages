import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmails } from "@/helpers/sendVerificationEmails";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const {username, email, password} = await request.json()
        console.log(200)
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        console.log(200)
        if(existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username already exist"
            }, {status: 400})
        }
        console.log(200)
        const existingUserByemail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 90000).toString()
        if(existingUserByemail) {
            if(existingUserByemail.isVerified) {
                return Response.json({
                    success: false,
                    message: "Email already exist"
                }, {status: 400})
            }
            const hashPassword = await bcrypt.hash(password, 10)
            existingUserByemail.password = hashPassword
            existingUserByemail.verifyCode = verifyCode
            existingUserByemail.verifyCodeExpiry = new Date(Date.now() + 3600000)
            existingUserByemail.username = username
            await existingUserByemail.save()
        }
        else {
            const hashPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel ({
                username,
                email,
                password: hashPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()
        }
        const emailResponse = await sendVerificationEmails(
            email,
            username,
            verifyCode
        )
        if(!emailResponse.success) {
            return Response.json({
                success: false,
                messages: "Failed to send email"
            }, {status: 400})
        }
        return Response.json({
            success: true,
            messages: "Email sent successfully"
        }, {status: 200})
    } catch(error) {
        console.error("Error while registring", error)
        return Response.json({
            success: false,
            message: "Error registring user"
        }, {status: 500})
    }
}