import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const {username, code} = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUsername})
        if(!user) {
            return Response.json({
                success: false,
                messages: "User not found"
            }, {status: 501})
        } 
        const isCodeValid = (user.verifyCode == code)
        if(!isCodeValid) {
            return Response.json({
                success: false,
                message: "Invalid Code"
            }, {status: 502})
        }
        const isDateExpired = new Date() <= new Date(user.verifyCodeExpiry)
        if(!isDateExpired) {
            return Response.json({
                success: false,
                message: "Code is expired"
            }, {status: 503})
        }
        user.isVerified = true
        await user.save()
        return Response.json({
            success: true,
            message: "Account verified successfully"
        }, {status: 200})
    } catch(error) {
        console.log("Error while verifying user", error)
        return Response.json({
            success: false,
            message: "Error while verifying code"
        }, {status: 504})
    }
}