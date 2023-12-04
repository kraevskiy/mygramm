import { Link, NavLink, useLocation } from 'react-router-dom';
import { paths } from '@/routes/paths.ts';
import { useUserContext } from '@/context/AuthContext.tsx';
import { sidebarLinks } from '@/constants';
import { INavLink } from '@/types';
import { Button } from '@/components/ui/button.tsx';
import { useSignOutAccountMutation } from '@/lib/react-query/queries.ts';

const LeftSidebar = () => {
	const {pathname} = useLocation();
	const {mutate: signOut} = useSignOutAccountMutation();
	const {user} = useUserContext();


	return (
		<nav className="leftsidebar">
			<div className="flex flex-col gap-11">
				<Link to={paths.home} className="flex gap-3 items-center">
					<img src="/assets/images/logo.svg" alt="Logo" width={170} height={36}/>
				</Link>

				<Link to={`${paths.profile}/${user.id}`} className="flex gap-3 items-center">
					<img src={user.imageUrl || '/assets/images/profile.png'} alt={user.username} className="h-14 w-14 rounded-full" />
					<span className="flex flex-col">
						<span className="body-bold">
							{user.name}
						</span>
						<span className="small-regular text-light-3">
							@{user.username}
						</span>
					</span>
				</Link>
				<ul className="flex flex-col gap-6">
					{
						sidebarLinks.map((link: INavLink) => {
							const isActive = pathname === link.route;
							return (
								<li key={link.label} className={`leftsidebar-link group${isActive ? ' bg-primary-500' : ''}`}>
									<NavLink to={link.route} className="flex gap-4 items-center p-4">
										<img src={link.imgURL} alt={link.label} className={`group-hover:invert-white${isActive ? ' invert-white' : ''}`} />
										{link.label}
									</NavLink>
								</li>
							)
						})
					}
				</ul>
			</div>
			<Button variant="ghost" className="shad-button_ghost" onClick={() => signOut()}>
				<img src="/assets/icons/logout.svg" alt="log out" />
				<p className="small-medium lg:base-medium">Logout</p>
			</Button>
		</nav>
	);
};

export default LeftSidebar;
