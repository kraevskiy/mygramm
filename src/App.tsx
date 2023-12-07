import AppRoutes from './routes/AppRoutes.tsx';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter } from 'react-router-dom';
import './globals.css';
import AuthProvider from '@/context/AuthContext.tsx';
import QueryProvider from '@/lib/react-query/QueryProvider.tsx';

const App = () => {

	return (
		<BrowserRouter>
			<QueryProvider>
				<AuthProvider>
					<main className="flex h-screen overflow-y-hidden">
						<AppRoutes />
						<Toaster />
					</main>
				</AuthProvider>
			</QueryProvider>
		</BrowserRouter>
	);
};

export default App;
