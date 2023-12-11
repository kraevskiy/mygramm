import { INewPost, INewUser, INewUserToDB, IUpdatePost, IUpdateUser } from '@/types';
import { account, appWriteConfig, avatars, databases, storage } from '@/lib/appwrite/config.ts';
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

export async function saveUserToDB(user: INewUserToDB) {
	try {
		return await databases.createDocument(appWriteConfig.databaseId, appWriteConfig.userCollectionId, ID.unique(), user);
	} catch (error) {
		console.log(error);
		return error;
	}
}

export async function signInAccount(user: { email: string; password: string }) {
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

export async function signOutAccount() {
	try {
		return await account.deleteSession('current')
	} catch (error) {
		console.error(error);
	}
}

export async function createPost(post: INewPost) {
	try {
		const uploadedFile = await uploadFile(post.file[0]);

		if (!uploadedFile) {
			throw Error;
		}

		const fileUrl = getFilePreview(uploadedFile.$id);
		if (!fileUrl) {
			await deleteFile(uploadedFile.$id);
			throw Error;
		}

		const tags = post.tags?.replace(/ /g, '').split(',') || [];

		const newPost = await databases.createDocument(
			appWriteConfig.databaseId,
			appWriteConfig.postCollectionId,
			ID.unique(),
			{
				creator: post.userId,
				caption: post.caption,
				imageUrl: fileUrl,
				imageId: uploadedFile.$id,
				location: post.location,
				tags: tags,
			}
		);

		if (!newPost) {
			await deleteFile(uploadedFile.$id);
			throw Error;
		}

		return newPost;
	} catch (error) {
		console.log(error);
	}
}

export async function uploadFile(file: File) {
	try {
		return await storage.createFile(
			appWriteConfig.storageId,
			ID.unique(),
			file
		);
	} catch (error) {
		console.log(error);
	}
}

export function getFilePreview(fileId: string) {
	try {
		const fileUrl = storage.getFilePreview(
			appWriteConfig.storageId,
			fileId,
			2000,
			2000,
			'top',
			100
		);

		if (!fileUrl) {
			throw Error;
		}

		return fileUrl;
	} catch (error) {
		console.log(error);
	}
}

export async function deleteFile(fileId: string) {
	try {
		await storage.deleteFile(appWriteConfig.storageId, fileId);

		return {status: 'ok'};
	} catch (error) {
		console.log(error);
	}
}

export async function likePost(postId: string, likesArray: string[]) {
	try {
		const updatedPost = await databases.updateDocument(
			appWriteConfig.databaseId,
			appWriteConfig.postCollectionId,
			postId,
			{
				likes: likesArray,
			}
		);

		if (!updatedPost) {
			throw Error;
		}

		return updatedPost;
	} catch (error) {
		console.log(error);
	}
}

export async function savePost(userId: string, postId: string) {
	try {
		const updatedPost = await databases.createDocument(
			appWriteConfig.databaseId,
			appWriteConfig.savesCollectionId,
			ID.unique(),
			{
				user: userId,
				post: postId,
			}
		);

		if (!updatedPost) {
			throw Error;
		}

		return updatedPost;
	} catch (error) {
		console.log(error);
	}
}

export async function deleteSavedPost(savedRecordId: string) {
	try {
		const statusCode = await databases.deleteDocument(
			appWriteConfig.databaseId,
			appWriteConfig.savesCollectionId,
			savedRecordId
		);

		if (!statusCode) {
			throw Error;
		}

		return {status: 'Ok'};
	} catch (error) {
		console.log(error);
	}
}


export async function getRecentPosts() {
	try {
		const posts = await databases.listDocuments(
			appWriteConfig.databaseId,
			appWriteConfig.postCollectionId,
			[Query.orderDesc('$createdAt'), Query.limit(20)]
		);

		if (!posts) {
			throw Error
		}

		return posts;
	} catch (error) {
		console.log(error);
	}
}

export async function getPostById(postId: string) {
	if (!postId) {
		throw Error;
	}

	try {
		const post = await databases.getDocument(
			appWriteConfig.databaseId,
			appWriteConfig.postCollectionId,
			postId
		);

		if (!post) {
			throw Error;
		}

		return post;
	} catch (error) {
		console.log(error);
	}
}

export async function updatePost(post: IUpdatePost) {
	const hasFileToUpdate = post.file.length > 0;

	try {
		let image = {
			imageUrl: post.imageUrl,
			imageId: post.imageId,
		};

		if (hasFileToUpdate) {
			const uploadedFile = await uploadFile(post.file[0]);
			if (!uploadedFile) {
				throw Error;
			}

			const fileUrl = getFilePreview(uploadedFile.$id);
			if (!fileUrl) {
				await deleteFile(uploadedFile.$id);
				throw Error;
			}

			image = {...image, imageUrl: fileUrl, imageId: uploadedFile.$id};
		}

		const tags = post.tags?.replace(/ /g, '').split(',') || [];

		const updatedPost = await databases.updateDocument(
			appWriteConfig.databaseId,
			appWriteConfig.postCollectionId,
			post.postId,
			{
				caption: post.caption,
				imageUrl: image.imageUrl,
				imageId: image.imageId,
				location: post.location,
				tags: tags,
			}
		);

		if (!updatedPost) {
			if (hasFileToUpdate) {
				await deleteFile(image.imageId);
			}

			throw Error;
		}

		if (hasFileToUpdate) {
			await deleteFile(post.imageId);
		}

		return updatedPost;
	} catch (error) {
		console.log(error);
	}
}

export async function deletePost(postId: string, imageId: string) {
	if (!postId || !imageId) {
		throw Error;
	}

	try {
		await databases.deleteDocument(
			appWriteConfig.databaseId,
			appWriteConfig.postCollectionId,
			postId
		)

		return {status: 'ok'};
	} catch (error) {
		console.log(error);
	}
}

export async function getInfinitePosts({pageParam}: { pageParam: number }) {
	const queries = [Query.orderDesc('$updatedAt'), Query.limit(10)];
	if (pageParam) {
		queries.push(Query.cursorAfter(pageParam.toString()))
	}
	console.log(queries);
	try {
		const posts = await databases.listDocuments(
			appWriteConfig.databaseId,
			appWriteConfig.postCollectionId,
			queries
		)

		if (!posts) {
			throw Error;
		}

		return posts;
	} catch (error) {
		console.log(error);
	}
}

export async function searchPosts(searchTerm: string) {

	try {
		const posts = await databases.listDocuments(
			appWriteConfig.databaseId,
			appWriteConfig.postCollectionId,
			[Query.search('caption', searchTerm)]
		)

		if (!posts) {
			throw Error;
		}

		return posts;
	} catch (error) {
		console.log(error);
	}
}

export async function getUsers(limit?: number) {
	const queries = [Query.orderDesc('$createdAt')];

	if (limit) {
		queries.push(Query.limit(limit));
	}

	try {
		const users = await databases.listDocuments(
			appWriteConfig.databaseId,
			appWriteConfig.userCollectionId,
			queries
		);

		if (!users) throw Error;

		return users;
	} catch (error) {
		console.log(error);
	}
}

export async function getUserById(userId: string) {
	try {
		const user = await databases.getDocument(
			appWriteConfig.databaseId,
			appWriteConfig.userCollectionId,
			userId
		);

		if (!user) throw Error;

		return user;
	} catch (error) {
		console.log(error);
	}
}

export async function updateUser(user: IUpdateUser) {
	const hasFileToUpdate = user.file.length > 0;
	try {
		let image = {
			imageUrl: user.imageUrl,
			imageId: user.imageId,
		};

		if (hasFileToUpdate) {
			const uploadedFile = await uploadFile(user.file[0]);
			if (!uploadedFile) throw Error;

			const fileUrl = getFilePreview(uploadedFile.$id);
			if (!fileUrl) {
				await deleteFile(uploadedFile.$id);
				throw Error;
			}

			image = {...image, imageUrl: fileUrl, imageId: uploadedFile.$id};
		}

		const updatedUser = await databases.updateDocument(
			appWriteConfig.databaseId,
			appWriteConfig.userCollectionId,
			user.userId,
			{
				name: user.name,
				bio: user.bio,
				imageUrl: image.imageUrl,
				imageId: image.imageId,
			}
		);

		if (!updatedUser) {
			if (hasFileToUpdate) {
				await deleteFile(image.imageId);
			}
			throw Error;
		}

		if (user.imageId && hasFileToUpdate) {
			await deleteFile(user.imageId);
		}

		return updatedUser;
	} catch (error) {
		console.log(error);
	}
}
