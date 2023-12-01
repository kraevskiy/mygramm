import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/appwrite/api.ts';
import { IAuthState, IAuthStateUser } from '@/types';
import { useNavigate} from 'react-router-dom';
import { paths } from '@/routes/paths.ts';

export const INITIAL_USER: IAuthStateUser = {
	id: '',
	name: '',
	username: '',
	email: '',
	imageUrl: '',
	bio: ''
}

const INITIAL_STATE: IAuthState = {
	user: INITIAL_USER,
	isLoading: false,
	isAuthenticated: false,
	setUser: () => {},
	setIsAuthenticated: () => {},
	checkAuthUser: async () => false as boolean
}

const AuthContext = createContext<IAuthState>(INITIAL_STATE);

const AuthProvider = ({children}: { children: ReactNode }) => {
	const navigate = useNavigate();
	const [user, setUser] = useState<typeof INITIAL_USER>(INITIAL_USER);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	const checkAuthUser = async () => {
		try {
			const currentAccount = await getCurrentUser();
			if (currentAccount) {
				setUser({
					id: currentAccount.$id,
					name: currentAccount.name,
					username: currentAccount.username,
					email: currentAccount.email,
					imageUrl: currentAccount.imageUrl,
					bio: currentAccount.bio
				})
			}
			setIsAuthenticated(true);
			return false;
		} catch (error) {
			console.log(error);
			return false;
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		if (localStorage.getItem('cookieFallback') =='[]'){
			navigate(paths.signIn);
		}
		checkAuthUser()
	}, [])

	const value = {
		user,
		setUser,
		isLoading,
		isAuthenticated,
		setIsAuthenticated,
		checkAuthUser
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
