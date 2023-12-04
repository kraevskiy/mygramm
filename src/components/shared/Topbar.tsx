import { Link, useNavigate } from 'react-router-dom';
import { paths } from '@/routes/paths.ts';
import { Button } from '@/components/ui/button.tsx';
import { useEffect } from 'react';
import { useUserContext } from '@/context/AuthContext.tsx';
import { useSignOutAccountMutation } from '@/lib/react-query/queries.ts';

const TopBar = () => {
	const {mutate: signOut, isSuccess} = useSignOutAccountMutation();
	const navigate = useNavigate();
	const {user} = useUserContext();

	useEffect(() => {
		if (isSuccess) {
			navigate(0)
		}
	}, [isSuccess])

	return (
		<section className="topbar">
			<div className="flex-between py-4 px-5">
				<Link to={paths.home} className="flex gap-3 items-center">
					<img src="/assets/images/logo.svg" alt="Logo" width={130} height={325}/>
				</Link>
				<div className="flex gar-4">
					<Button variant="ghost" className="shad-button_ghost" onClick={() => signOut()}>
						<img src="/assets/icons/logout.svg" alt="log out" />
					</Button>
					<Link to={`${paths.profile}/${user.id}`} className="flex-center gap-3">
						<img src={user.imageUrl || '/assets/icons/profile-placeholder.png'} alt={user.username} className="h-8 w-8 rounded-full" />
					</Link>
				</div>
			</div>
		</section>
	);
};

export default TopBar;
