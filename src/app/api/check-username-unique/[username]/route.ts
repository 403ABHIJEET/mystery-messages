import dbConnect from "@/lib/dbConnect";
import { z } from 'zod'
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest } from 'next/server';

const usernameQueryValidation = z.object({
    username: usernameValidation
})

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, {params}: {params : { username: string } }) {
    await dbConnect()
    try {
        const username = params.username
        console.log(username)
        const existUsername = await UserModel.findOne({
            username,
        })
        if (existUsername) {
            return Response.json({
                success: false,
                message: "Username already exist"
            }, { status: 502 })
        }
        return Response.json({
            success: true,
            message: "Username available"
        }, { status: 200 })
    } catch (error) {
        console.error("Error while checking username", error)
        return Response.json({
            success: false,
            message: "Error in checking message"
        }, { status: 503 })
    }
}