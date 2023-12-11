import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loader from '@/components/shared/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { paths } from '@/routes/paths';
import { useToast } from '@/components/ui/use-toast';
import { useUserContext } from '@/context/AuthContext';
import { SignInInputs, SignInSchema } from '@/lib/validation/sign-in.schema';
import { useSignInAccountMutation } from '@/lib/react-query/queries';

const SigninForm = () => {
	const {toast} = useToast();
	const navigate = useNavigate();
	const {checkAuthUser, isLoading: isUserLoading} = useUserContext();

	const form = useForm<SignInInputs>({
		resolver: zodResolver(SignInSchema),
		defaultValues: {
			email: '',
			password: ''
		},
	})

	const {mutateAsync: signInAccount, isPending: isSignInAccountLoading} = useSignInAccountMutation();

	const onSubmit = async (values: SignInInputs) => {
		const session = await signInAccount({
			email: values.email,
			password: values.password
		})

		if (!session) {
			return toast({
				title: 'Sign in failed. Pls try again',
			})
		}

		const isLogIn = await checkAuthUser();
		if (isLogIn) {
			form.reset();
			navigate(paths.home);
		} else {
			return toast({title: 'Sign up failed. Pls try again'})
		}
	}

	return (
		<Form {...form}>
			<div className="sm:w-420 flex-center flex-col">
				<img src="/assets/images/logo.svg" alt="logo" />

				<h2 className="h3-bold md:h2-bold pt-5 sm:pt-8">
					Log in to your account
				</h2>
				<p className="text-light-3 small-medium md:base-regular mt-2">
					Please enter your details
				</p>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
					<FormField
						control={form.control}
						name="email"
						render={({field}) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" className="shad-input" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({field}) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" className="shad-input" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="shad-button_primary">
						{ isSignInAccountLoading || isUserLoading ? (
							<div className="flex-center gap-2">
								<Loader /> Loading...
							</div>
						) : 'Sign in'}
					</Button>
					<p className="text-small-regular text-light-2 text-center mt-2">
						Don't have an account?
						<Link
							to={paths.signUp}
							className="text-primary-500 text-small-semibold ml-1">
							Sign up
						</Link>
					</p>
				</form>
			</div>
		</Form>
	);
};

export default SigninForm;
