import { Route, Routes } from 'react-router-dom';
import { paths } from './paths.ts';
import SigninForm from '../_auth/forms/SigninForm.tsx';
import { Home } from '../_root/pages';
import SignupForm from '../_auth/forms/SignupForm.tsx';
import AuthLayout from '../_auth/AuthLayout.tsx';
import RootLayout from '../_root/RootLayout.tsx';

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
			</Route>
		</Routes>
	);
};

export default AppRoutes;
