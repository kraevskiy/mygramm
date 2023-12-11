import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from '@/components/ui/toaster';
import AuthProvider from '@/context/AuthContext';
import QueryProvider from '@/lib/react-query/QueryProvider';

import './globals.css';

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
