import { INewUser, INewUserToDB } from '@/types';
import { account, appWriteConfig, avatars, databases } from '@/lib/appwrite/config.ts';
import { ID, Query } from 'appwrite';

export async function createUserAccount(user: INewUser) {
	try {
		const newAccount = await account.create(
			ID.unique(),
			user.email,
			user.password,
			user.name
		);

		if (!newAccount) {
			throw Error
		}
		const avatarUrl = avatars.getInitials(user.name);
		return await saveUserToDB({
			accountId: newAccount.$id,
			name: newAccount.name,
			email: newAccount.email,
			username: user.username,
			imageUrl: avatarUrl
		});
	} catch (error) {
		console.log(error);
		return error;
	}
}

export async function saveUserToDB (user: INewUserToDB) {
	try {
		return await databases.createDocument(appWriteConfig.databaseId, appWriteConfig.userCollectionId, ID.unique(), user);
	} catch (error) {
		console.log(error);
		return error;
	}
}

export async function signInAccount(user: {email: string; password: string}) {
	try {
		return await account.createEmailSession(user.email, user.password)

	} catch (error) {
		console.error(error);
	}
}

export async function getCurrentUser() {
	try {
		const currentAccount = await account.get();
		if (!currentAccount) {
			throw Error
		}

		const currentUser = await databases.listDocuments(
			appWriteConfig.databaseId,
			appWriteConfig.userCollectionId,
			[Query.equal('accountId', currentAccount.$id)]
		)
		if (!currentAccount) {
			throw Error
		}

		return currentUser.documents[0]
	} catch (error) {
		console.error(error);
	}
}
