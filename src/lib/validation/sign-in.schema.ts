import * as z from 'zod';

export const SignInSchema = z.object({
	username: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
})

export type SignInInputs = z.infer<typeof SignInSchema>
