import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';
import { INewPost, INewUser, IUpdatePost } from '@/types';
import { createPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, likePost, savePost, searchPosts, signInAccount, signOutAccount, updatePost } from '@/lib/appwrite/api.ts';


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

export const useGetRecentPostsQuery = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
		queryFn: getRecentPosts,
	});
};

export const useCreatePostMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (post: INewPost) => createPost(post),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
		},
	});
};

export const useLikePostMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			postId,
			likesArray,
		}: {
			postId: string;
			likesArray: string[];
		}) => likePost(postId, likesArray),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});
		},
	});
};

export const useSavePostMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({userId, postId}: { userId: string; postId: string }) =>
			savePost(userId, postId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});
		},
	});
};

export const useDeleteSavedPostMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});
		},
	});
};

export const useGetCurrentUserQuery = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_CURRENT_USER],
		queryFn: getCurrentUser
	})
};

export const useGetPostByIdQuery = (postId: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
		queryFn: () => getPostById(postId),
		enabled: !!postId
	})
};

export const useUpdatePostMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (post: IUpdatePost) => updatePost(post),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
			});
		},
	});
};

export const useDeletePostMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({postId, imageId}: { postId: string; imageId: string }) => deletePost(postId, imageId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
		},
	});
};

export const useGetPostInfiniteQuery = () => {
	return useInfiniteQuery({
		queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
		queryFn: getInfinitePosts,
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		getNextPageParam: (lastPage) => {
			if (lastPage && lastPage.documents.length === 0) {
				return null;
			}
			// else {
			// 	return lastPageParam + 1;
			// }
			if (!lastPage) {
				return null;
			}
			return lastPage.documents[lastPage.documents.length - 1].$id;
		}
	});
}


export const useSearchPostsQuery = (searchTerm: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
		queryFn: () => searchPosts(searchTerm),
		enabled: !!searchTerm
	})
}
