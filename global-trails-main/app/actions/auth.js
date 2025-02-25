'use server';
import bcrypt from 'bcrypt';

import { createUser, getUser } from '@/lib/users';
import { redirect } from 'next/navigation';
import { createAuthSession, destroySession } from '@/lib/auth';

export async function signup(prevState, formData) {
	const errors = {};
	const email = formData.get('email');
	const name = formData.get('name');
	const password = formData.get('password');

	if (!email.includes('@')) {
		errors.email = 'Invalid email.';
	}

	if (password.trim().length < 8) {
		errors.password = 'Password must be at least 8 characters long.';
	}

	if (name.trim().length === 0) {
		errors.name = 'Please enter a valid name.';
	}

	if (Object.keys(errors).length > 0) {
		return {
			errors,
		};
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	let userId;

	try {
		userId = createUser(email, name, hashedPassword);
	} catch (err) {
		errors.other = 'Could not create an account. Please try again later.';
		console.log(err);
		return {
			errors,
		};
	}

	await createAuthSession(userId);
	redirect('/places');
}

export async function login(prevState, formData) {
	const errors = {};
	const email = formData.get('email');
	const password = formData.get('password');

	const user = getUser(email);

	if (!user || !user.email || !user.password) {
		errors.user = 'Could not authenticate, please check your credentials and try again.';
		return {
			errors,
		};
	}

	const passwordValid = await bcrypt.compare(password, user.password);

	if (!passwordValid) {
		errors.user = 'Invalid credentials, please check your credentials and try again.';
		return {
			errors,
		};
	}

	await createAuthSession(user.id);
	redirect('/places');
}

export async function logout() {
	await destroySession();
	redirect('/');
}
