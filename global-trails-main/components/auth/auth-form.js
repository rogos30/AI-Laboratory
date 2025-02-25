'use client';
import Link from 'next/link';
import { useFormState } from 'react-dom';

import { login, signup } from '@/app/actions/auth';

export function SignUpForm() {
	const [formState, formAction] = useFormState(signup, {});

	return (
		<form action={formAction} className='py-8 flex flex-col items-center gap-4'>
			<div className='flex flex-col items-center gap-4'>
				<label htmlFor='email'>Email</label>
				<input type='email' name='email' id='email' className='p-2 border-secondary border-2 rounded-2xl' />
			</div>
			<div className='flex flex-col items-center gap-4'>
				<label htmlFor='name'>Nazwa</label>
				<input type='text' name='name' id='name' className='p-2 border-secondary border-2 rounded-2xl' />
			</div>
			<div className='flex flex-col items-center gap-4'>
				<label htmlFor='password'>Hasło</label>
				<input type='password' name='password' id='password' className='p-2 border-secondary border-2 rounded-2xl' />
			</div>

			<Link href='/login'>Przejdź do logowania</Link>
			{JSON.stringify(formState.errors)}
			<button className='w-1/2 mt-4 py-2 bg-secondary text-white uppercase font-semibold rounded-2xl'>Załóż konto</button>
		</form>
	);
}

export function LoginForm() {
	const [formState, formAction] = useFormState(login, {});

	return (
		<form action={formAction} className='py-8 flex flex-col items-center gap-4'>
			<div className='flex flex-col items-center gap-4'>
				<label htmlFor='email'>Email</label>
				<input type='email' name='email' id='email' className='p-2 border-secondary border-2 rounded-2xl' />
			</div>
			<div className='flex flex-col items-center gap-4'>
				<label htmlFor='password'>Hasło</label>
				<input type='password' name='password' id='password' className='p-2 border-secondary border-2 rounded-2xl' />
			</div>
			<Link href='/signup'>Załóż nowe konto</Link>
			{JSON.stringify(formState.errors)}
			<button className='w-1/2 mt-4 py-2 bg-secondary text-white uppercase font-semibold rounded-2xl'>Zaloguj</button>
		</form>
	);
}
