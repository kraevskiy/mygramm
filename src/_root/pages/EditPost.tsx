import PostForm from '@/components/forms/PostForm.tsx';
import { useParams } from 'react-router-dom';
import { useGetPostByIdQuery } from '@/lib/react-query/queries.ts';
import { Loader } from '@/components/shared';

const EditPost = () => {
	const {id} = useParams();
	const {data: post, isPending: isPendingPost} = useGetPostByIdQuery(id || '');

	if (isPendingPost) {
		return <Loader />
	}

	return (
		<div className="flex flex-1">
			<div className="common-container">
				<div className="max-w-5xl flex-start gap-3 justify-start w-full">
					<img
						src="/assets/icons/add-post.svg"
						width={36}
						height={36}
						alt="add"
					/>
					<h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
				</div>
				{
					!post ? <div>
						Post not find
					</div> : <PostForm action="Update" post={post} />
				}
			</div>
		</div>
	);
};

export default EditPost;
