import * as z from 'zod';

export const SignInSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, {message: 'Password not correct'}),
})

export type SignInInputs = z.infer<typeof SignInSchema>
