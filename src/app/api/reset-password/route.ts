import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, password, confirmPassword } = await req.json();
        if (password !== confirmPassword) {
            return new Response(JSON.stringify({
                success: false,
                message: "Please write the same confirm password as password"
            }), { status: 400 });
        }

        const user = await UserModel.findOne({ username });
        if (user) {
            const hashPassword = await bcrypt.hash(password, 10)
            user.password = hashPassword;
            await user.save();
            return new Response(JSON.stringify({
                success: true,
                message: "Password updated successfully"
            }), { status: 200 });
        }

        return new Response(JSON.stringify({
            success: false,
            message: "User is not registered"
        }), { status: 404 });

    } catch (error) {
        console.error("Error while resetting password", error);
        return new Response(JSON.stringify({
            success: false,
            message: "Error while resetting password"
        }), { status: 500 });
    }
}