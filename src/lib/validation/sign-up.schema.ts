import * as z from 'zod';

export const SignUpSchema = z.object({
	name: z.string().min(2, {message: 'Too short'}),
	username: z.string().min(2, {message: 'Too short'}),
	email: z.string().email(),
	password: z.string().min(8, {message: 'Password not correct'}),
})

export type SignUpInputs = z.infer<typeof SignUpSchema>
