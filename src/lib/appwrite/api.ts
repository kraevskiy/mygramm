import { INewUser } from '@/types';
import { account } from '@/lib/appwrite/config.ts';
import { ID } from 'appwrite';

export const createUserAccount = async (user: INewUser) => {
	try {
		return await account.create(
			ID.unique(),
			user.email,
			user.password,
			user.name
		);

	} catch (e) {
		console.log(e);
		return e;
	}
}
