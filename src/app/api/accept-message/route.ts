import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 })
    }
    const userId = user._id
    const { acceptMessages } = await req.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status",
                updatedUser
            }, { status: 400 })
        }
        return Response.json({
            success: true,
            message: "User status updated successfully"
        }, { status: 200 })
    } catch (error) {
        console.error("Failed to update user status", error)
    }
}

export async function GET(req: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "User not authenticated"
        }, {status: 5001})
    }
    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 500})
        }
        return Response.json({
            success: true,
            isAcceptingMessage: foundUser.isAcceptingMessage
        }, { status: 200 })
    } catch (error) {
        console.error("Failed to update user status to accespt message", error)
        return Response.json({
            success: false,
            message: "Error is getting message acceptance status"
        }, {status: 400})
    }
}