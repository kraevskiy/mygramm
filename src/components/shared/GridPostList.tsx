import { Models } from 'appwrite';
import { useUserContext } from '@/context/AuthContext.tsx';
import { Link } from 'react-router-dom';
import { paths } from '@/routes/paths.ts';
import { PostStats } from '@/components/shared';

type GridPostsListProps = {
	posts?: Models.Document[];
	showUser?: boolean;
	showStats?: boolean;
}

const GridPostList = ({posts, showUser = true, showStats = true }: GridPostsListProps) => {
	const {user} = useUserContext();
	return (
		<ul className="grid-container">
			{posts ? posts.map((post) => (
				<li key={post.$id} className="relative min-w-80 h-80">
					<Link to={`${paths.posts}/${post.$id}`} className="grid-post_link">
						<img src={post.imageUrl} alt={post.caption} className="h-full w-full object-cover"/>
					</Link>
					<div className="grid-post_user">
						{showUser && (
							<div className="flex items-center justify-start gap-2 flex-1">
								<img src={post.creator.imageUrl} alt={post.creator.name} className="h-8 w-8 rounded-full"/>
								<p className="line-clamp-1">{post.creator.name}</p>
							</div>
						)}
						{
							showStats && <PostStats post={post} userId={user.id} />
						}
					</div>
				</li>
			)) : (
				<li className="text-light-4 mt-10 text-center w-full">
					Posts not found
				</li>
			)}
		</ul>
	);
};

export default GridPostList;
