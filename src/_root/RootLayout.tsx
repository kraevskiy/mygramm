import { Outlet } from 'react-router-dom';
import TopBar from '@/components/shared/Topbar.tsx';
import LeftSidebar from '@/components/shared/LeftSidebar.tsx';
import BottomBar from '@/components/shared/Bottombar.tsx';

const RootLayout = () => {

	return (
		<div className="w-full md:flex">
			<TopBar />
			<LeftSidebar />
			<section className="flex flex-1 h-full pb-32 md:pb-0">
				<Outlet />
			</section>

			<BottomBar />
		</div>
	);
};

export default RootLayout;
