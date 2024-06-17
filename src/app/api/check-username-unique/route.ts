import dbConnect from "@/lib/dbConnect";
import {z} from 'zod'
import UserModel from "@/model/User"; 
import { usernameValidation } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";

const usernameQueryValidation = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect()
    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        const result = usernameQueryValidation.safeParse(queryParam)
        if(!result.success) {
            const usernamErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernamErrors[0] 
            }, {status: 400})
        }
        const {username} = result.data
        const existUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if(existUsername) {
            return Response.json({
                success: false,
                message: "Username already exist"
            }, {status: 502})
        }
        return Response.json({
            success: true,
            message: "Username available"
        }, {status: 200})
    } catch(error) {
        console.error("Error while checking username", error)
        return Response.json({
            success: false,
            message: "Error in checking message"
        }, {status: 503})
    }
}