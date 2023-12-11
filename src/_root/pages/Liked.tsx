import { GridPostList, Loader } from '@/components/shared';
import { useGetCurrentUserQuery } from '@/lib/react-query/queries';

const Liked = () => {
	const { data: currentUser } = useGetCurrentUserQuery();

	if (!currentUser)
		return (
			<div className="flex-center w-full h-full">
				<Loader />
			</div>
		);
	return (
		<>
			{currentUser.liked.length === 0 && (
				<p className="text-light-4">No liked posts</p>
			)}

			<GridPostList posts={currentUser.liked} showStats={false} />
		</>
	);
};

export default Liked;
