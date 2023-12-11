import { paths } from '@/routes/paths';
import { INavLink } from '@/types';

export const sidebarLinks: INavLink[] = [
	{
		imgURL: "/assets/icons/home.svg",
		route: paths.home,
		label: "Home",
	},
	{
		imgURL: "/assets/icons/wallpaper.svg",
		route: paths.explore,
		label: "Explore",
	},
	{
		imgURL: "/assets/icons/people.svg",
		route: paths.users,
		label: "People",
	},
	{
		imgURL: "/assets/icons/bookmark.svg",
		route: paths.saved,
		label: "Saved",
	},
	{
		imgURL: "/assets/icons/gallery-add.svg",
		route: "/create-post",
		label: "Create Post",
	},
];

export const bottombarLinks: INavLink[] = [
	{
		imgURL: "/assets/icons/home.svg",
		route: "/",
		label: "Home",
	},
	{
		imgURL: "/assets/icons/wallpaper.svg",
		route: "/explore",
		label: "Explore",
	},
	{
		imgURL: "/assets/icons/bookmark.svg",
		route: "/saved",
		label: "Saved",
	},
	{
		imgURL: "/assets/icons/gallery-add.svg",
		route: "/create-post",
		label: "Create",
	},
];
