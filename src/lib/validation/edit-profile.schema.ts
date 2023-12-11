import * as z from 'zod';

export const EditProfileSchema = z.object({
	file: z.custom<File[]>(),
	name: z.string().min(2, { message: "Name must be at least 2 characters." }),
	username: z.string().min(2, { message: "Name must be at least 2 characters." }),
	email: z.string().email(),
	bio: z.string(),
})

export type EditProfileInputs = z.infer<typeof EditProfileSchema>
