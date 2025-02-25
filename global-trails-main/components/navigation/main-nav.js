import { logout } from '@/app/actions/auth';
import { verifyAuth } from '@/lib/auth';
import { getUsers } from '@/lib/users';
import Link from 'next/link';

export default async function MainNavigation() {
	const auth = await verifyAuth();
	const users = getUsers();

	const authLinks = auth.session ? (
		<Link href='/places/new'>
			<li>Dodaj nowe miejsce</li>
		</Link>
	) : null;

	return (
		<header className='bg-white'>
			<nav className='py-8 container mx-auto flex items-center justify-between gap-32'>
				<h1 className='text-2xl font-semibold flex items-center'>
					<span className='mr-2 material-symbols-outlined'>travel_explore</span>Gnikoob
				</h1>
				<ul className='flex gap-16'>
					<Link href='/'>
						<li>Strona główna</li>
					</Link>
					<Link href='/places'>
						<li>Miejsca</li>
					</Link>
					{authLinks}
					{!auth.session && (
						<Link href='/login'>
							<li>Zaloguj się</li>
						</Link>
					)}
					{auth.session && (
						<form action={logout}>
							<button>Wyloguj się</button>
						</form>
					)}
				</ul>
			</nav>
		</header>
	);
}
