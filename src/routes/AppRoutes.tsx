import { Route, Routes } from 'react-router-dom';
import { paths } from './paths.ts';
import SigninForm from '@/_auth/forms/SigninForm.tsx';
import { CreatePost, EditPost, Explore, Home, Liked, PostDetails, Profile, Saved, UpdateProfile, Users } from '@/_root/pages';
import SignupForm from '@/_auth/forms/SignupForm.tsx';
import AuthLayout from '@/_auth/AuthLayout.tsx';
import RootLayout from '@/_root/RootLayout.tsx';

const AppRoutes = () => {

	return (
		<Routes>
			{/*	Public Routes*/}
			<Route element={<AuthLayout />}>
				<Route path={paths.signIn} element={<SigninForm />} />
				<Route path={paths.signUp} element={<SignupForm />} />
			</Route>
			{/*	Private Routes*/}
			<Route element={<RootLayout />}>
				<Route index element={<Home />} />
				<Route path={paths.explore} element={<Explore />} />
				<Route path={paths.saved} element={<Saved />} />
				<Route path={paths.users} element={<Users />} />
				<Route path={paths.createPost} element={<CreatePost />} />
				<Route path={`${paths.updatePost}/:id`} element={<EditPost />} />
				<Route path={`${paths.posts}/:id`} element={<PostDetails />} />
				<Route path={`${paths.profile}/:id/*`} element={<Profile />} />
				<Route path={`${paths.updateProfile}/:id`} element={<UpdateProfile />} />
				<Route path={paths.liked} element={<Liked />} />
			</Route>
		</Routes>
	);
};

export default AppRoutes;
