import {z} from 'zod';

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleats 2 character")
    .max(20, "Username must be atmost 15 character")
    .regex(/^[a-zA-Z0-9_-]+$/, "Invalid username")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must contain atleast 6 character"})
})