import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

import MainNavigation from '@/components/navigation/main-nav';
import Footer from '@/components/ui/footer';

import './globals.css';
import './globalicons.css';

export const metadata = {
	title: 'Gnikoob',
	description: 'Find the best place for you.',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className={GeistSans.className}>
				<div id='modal'></div>
				<MainNavigation />
				{children}
				<Footer />
			</body>
		</html>
	);
}
