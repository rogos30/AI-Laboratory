'use server';

import { deletePlace, hidePlace, showPlace } from '@/lib/places';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function removePlaceAction(formData) {
	const place = formData.get('place');

	try {
		deletePlace(place);
		revalidatePath('/places', 'layout');
	} catch (err) {
		console.log(err);
	}
	redirect('/places');
}

export async function hidePlaceAction(formData) {
	const placeSlug = formData.get('place');

	try {
		hidePlace(placeSlug);
		revalidatePath('/places', 'layout');
	} catch (err) {
		console.log(err);
	}
	redirect('/places');
}

export async function showPlaceAction(formData) {
	const placeSlug = formData.get('place');

	try {
		showPlace(placeSlug);
		revalidatePath('/places', 'layout');
	} catch (err) {
		console.log(err);
	}
	redirect('/places');
}
