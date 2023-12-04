import { useMutation } from '@tanstack/react-query';
import { createUserAccount, signInAccount, signOutAccount } from '@/lib/appwrite/api.ts';
import { INewUser } from '@/types';

export const useCreateUserAccountMutation = () => {
	return useMutation({
		mutationFn: (user: INewUser) => createUserAccount(user)
	})
}

export const useSignInAccountMutation = () => {
	return useMutation({
		mutationFn: (user: { email: string; password: string }) => signInAccount(user)
	})
}

export const useSignOutAccountMutation = () => {
	return useMutation({
		mutationFn: signOutAccount
	})
}

