import { MouseEvent, useEffect } from 'react';
import { Models } from 'appwrite';
import { useDeleteSavedPostMutation, useGetCurrentUserQuery, useLikePostMutation, useSavePostMutation } from '@/lib/react-query/queries.ts';
import { useState } from 'react';
import { checkIsLiked } from '@/lib/utils.ts';
import { Loader } from '@/components/shared/index.ts';

type PostStatsProps = {
	post: Models.Document,
	userId: string
}

const PostStats = ({post, userId}: PostStatsProps) => {
	const likesList = post.likes.map((user: Models.Document) => user.$id);

	const [likes, setLikes] = useState(likesList);
	const [isSaved, setIsSaved] = useState(false);

	const {mutate: likePost} = useLikePostMutation();
	const {mutate: savePost, isPending: isSavingPost} = useSavePostMutation();
	const {mutate: deleteSavePost, isPending: isDeletingPost} = useDeleteSavedPostMutation();

	const {data: currentUser} = useGetCurrentUserQuery();

	const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id);

	useEffect(() => {
		setIsSaved(!!savedPostRecord)
	}, [currentUser]);

	const handleLikePost = (e: MouseEvent) => {
		e.stopPropagation();

		let likesArray = [...likes];

		if (likesArray.includes(userId)) {
			likesArray = likesArray.filter((Id) => Id !== userId);
		} else {
			likesArray.push(userId);
		}

		setLikes(likesArray);
		likePost({postId: post.$id, likesArray});
	}

	const handleSavePost = (e: MouseEvent) => {
		e.stopPropagation();
		if (currentUser) {

			if (savedPostRecord) {
				setIsSaved(false);
				deleteSavePost(savedPostRecord.$id)
			} else {
				savePost({userId: currentUser.$id, postId: post.$id});
				setIsSaved(true)
			}
		}
	}

	return (
		<div className="flex justify-between items-center z-20">
			<div className="flex gap-2 mr-5">
				<img
					src={checkIsLiked(likes, userId) ? '/assets/icons/liked.svg' : '/assets/icons/like.svg'}
					alt="liked"
					width={20}
					height={20}
					onClick={handleLikePost}
					className="cursor-pointer"
				/>

				<p className="small-medium lg:base-medium">{likes.length}</p>
			</div>
			<div className="flex gap-2">
				{isSavingPost || isDeletingPost ? <Loader /> :
					<img
						src={isSaved ? '/assets/icons/saved.svg' : '/assets/icons/save.svg'}
						alt="saves"
						width={20}
						height={20}
						onClick={handleSavePost}
						className="cursor-pointer"
					/>
				}
			</div>
		</div>
	);
};

export default PostStats;
