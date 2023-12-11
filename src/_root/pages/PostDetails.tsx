import { useDeletePostMutation, useGetPostByIdQuery } from '@/lib/react-query/queries';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Loader, PostStats } from '@/components/shared';
import { paths } from '@/routes/paths';
import { multiFormatDateString } from '@/lib/utils';
import { useUserContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PostDetails = () => {
	const {id} = useParams();
	const {user} = useUserContext();
	const {toast} = useToast();

	const {data: post, isPending} = useGetPostByIdQuery(id || '');
	const {mutateAsync: handleDelete, isPending: isDeletingPending} = useDeletePostMutation();

	const handleDeletePost = async () => {
		const res = await handleDelete({
			postId: post?.$id || '',
			imageId: post?.imageId || ''
		});
		if (res?.status === 'ok') {
			toast({title: 'Post was deleted'});
			return <Navigate to={paths.home} />;
		}
		toast({title: 'Something went wrong'})
	}

	return (
		<div className="post_details-container">
			{isPending ? <Loader /> : post ? (
				<div className="post_details-card">
					<img src={post.imageUrl} alt="creator" className="post_details-img" />
					<div className="post_details-info">
						<div className="flex-between w-full">
							<Link to={`${paths.profile}/${post.creator.$id}`} className="flex items-center gap-3">
								<img
									src={post.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'}
									alt="creator"
									className="rounded-full w-12 lg:h-12"
								/>
								<div className="flex flex-col">
									<p className="base-medium lg:body-bold text-light-1">{post.creator?.name}</p>
									<div className="flex-center gap-2 text-light-3">
										<p className="subtle-semibold lg:small-regular">
											{multiFormatDateString(post.$createdAt)}
										</p>
										-
										<p className="subtle-semibold lg:small-regular">
											{post.location}
										</p>
									</div>
								</div>
							</Link>
							<div className="flex-center">
								<Link
									to={`${paths.updatePost}/${post.$id}`}
									className={`${user.id !== post.creator.$id && 'hidden'}`}
								>
									<img src="/assets/icons/edit.svg" alt="edit" width={24} height={24} />
								</Link>
								<Button
									onClick={handleDeletePost}
									value="ghost"
									className={`${user.id !== post.creator.$id && 'hidden'} ghost_details-delete_btn`}
								>
									{isDeletingPending ? <Loader /> :
										<img src="/assets/icons/delete.svg" alt="delete" width={24} height={24} />}
								</Button>
							</div>
						</div>
						<hr className="border w-full border-dark-4/80" />
						<div className="flex flex-col flex-1 w-full small-medium ls:base-regular">
							<p>{post.caption}</p>
							<ul className="flex gap-1 mt-2">
								{post.tags.map((tag: string) => (
									<li key={tag} className="text-light-1">
										#{tag}
									</li>
								))}
							</ul>
						</div>
						<div className="w-full">
							<PostStats post={post} userId={user.id} />
						</div>
					</div>
				</div>
			) : (
				<div>Post not found</div>
			)}
		</div>
	);
};

export default PostDetails;
