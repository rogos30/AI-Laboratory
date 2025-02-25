'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { addPlace, addReview, deletePlace, deleteReview, getReviewById, rentPlace } from '@/lib/places';
import { formatSlug, isImgUrl } from '@/utils/slug-formater';
import { getUserById, hasRented } from '@/lib/users';
import getCityByName from '@/lib/cities';

const DEFAULT_IMAGE = 'https://download.cloudgdansk.pl/gdansk-pl/t/201801102063.jpg';

function checkLength(text) {
	return text.trim().length > 0;
}

export async function deletePlaceAction(slug) {
	deletePlace(slug);
	revalidatePath('/places', 'layout');
}

export async function addPlaceAction(prevState, formData) {
	const errors = {};
	const place = {
		name: formData.get('name'),
		description: formData.get('description'),
		address: formData.get('address'),
		image: formData.get('image'),
		price: formData.get('price'),
		city: formData.get('city'),
		user: formData.get('user'),
	};

	if (
		!checkLength(place.name) ||
		!checkLength(place.description) ||
		!checkLength(place.address) ||
		!checkLength(place.price)
	) {
		errors.empty = 'All fields are required.';
	}

	if (!getCityByName(place.city)) {
		errors.other = 'No such city, please try again later.';
	}

	if (!getUserById(place.user)) {
		errors.other = 'Something went wrong, please try again later.';
	}

	if (Object.keys(errors).length > 0) {
		return {
			errors,
		};
	}

	const image = isImgUrl(place.image) ? place.image : DEFAULT_IMAGE;
	const slug = formatSlug(place.name);

	addPlace(place.name, slug, place.description, place.address, image, place.price, place.city, place.user);
	revalidatePath('/places');
	redirect(`/places/${slug}`);
}

export async function checkIfUserCanComment(user, place) {
	hasRented(user, place);
}

export async function addReviewAction(prevState, formData) {
	const errors = {};
	const review = {
		date: formData.get('date'),
		rating: formData.get('rating'),
		comment: formData.get('comment'),
		place: formData.get('place'),
		user: formData.get('user'),
	};

	if (!checkLength(review.date) || !checkLength(review.rating) || !checkLength(review.comment)) {
		errors.empty = 'All fields are required.';
	}

	if (!checkLength(review.place) || !checkLength(review.user)) {
		errors.other = 'Something went wrong, please try again later.';
	}

	if (!hasRented(review.user, review.place)) {
		errors.forbidden = 'You can only add feedback if you rented this place.';
	}

	if (Object.keys(errors).length > 0) {
		return {
			errors,
		};
	}

	try {
		await addReview(review.place, review.user, review.date, review.rating, review.comment);
		revalidatePath('/places', 'layout');
	} catch (err) {
		errors.other = 'Something went wrong, please try again later.';
		return {
			errors,
		};
	}
}

export async function rentPlaceAction(prevState, formData) {
	const errors = {};
	const transaction = {
		user: formData.get('user'),
		place: formData.get('place'),
	};

	if (!transaction.user || !transaction.place) {
		errors.other = 'Something went wrong, please try again later.';
		return {
			errors,
		};
	}

	await rentPlace(transaction.place, transaction.user);
	revalidatePath('/places', 'layout');
}

export async function deleteReviewAction(prevState, formData) {
	const errors = {};

	const review = {
		user: formData.get('user'),
		id: formData.get('review'),
	};

	const existingReview = getReviewById(review.id);
	const existingUser = getUserById(review.user);

	if (!existingReview || !existingUser) {
		errors.other = '1Something went wrong, please try again later.';
		return {
			errors,
		};
	}

	if (existingReview.user != review.user && existingUser.role !== 'admin' && existingUser.role !== 'moderator') {
		errors.permissions = 'Insufficient permissions, action prohibited.';
		return {
			errors,
		};
	}

	try {
		deleteReview(review.id);
		revalidatePath('/places', 'layout');
	} catch (err) {
		errors.other = 'Something went wrong, please try again later.';
		return {
			errors,
		};
	}
}
