import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function DELETE(request: Request, {params}: {params : { messageid: string } }) {
    const session = await getServerSession(authOptions);
    const _user: User = session?.user;
    const messageId = params.messageid
    await dbConnect()
    if (!session || !_user) {
        return Response.json({ 
            success: false, 
            message: 'Not authenticated' 
        }, { status: 401 });
    }
    try {
        const updatedResult = await UserModel.updateOne(
            { _id: _user._id },
            {$pull: { messages: { _id: messageId } } }
        )
        if(updatedResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            }, {status: 404}) 
        }
        return Response.json({
            success: true,
            message: "Message deleted successfully"
        }, {status: 200})
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error while deleting message"
        }, {status: 500})
    }
}