import db from './db';

export function getPlacesForCity(city) {
	return db
		.prepare(
			`
        SELECT * FROM places, rentals WHERE places.id = rentals.place AND city = ? ORDER BY id DESC
    `
		)
		.all(city);
}

export function getAllPlaces() {
	return db
		.prepare(
			`
		SELECT * FROM places, rentals WHERE places.id = rentals.place
	`
		)
		.all();
}

export function getSliceOfPlaces(city, offset) {
	let places = [];
	if (city) {
		places = getPlacesForCity(city);
	} else {
		places = getAllPlaces();
	}

	places = places.filter((place, index) => index >= +offset && index < +offset + 5);
	const newOffset = places.length === 5 ? +offset + 5 : offset;

	return {
		places: places,
		offset: newOffset,
	};
}

export function getPlace(slug) {
	return db
		.prepare(
			`
        SELECT * FROM places, rentals WHERE places.id = rentals.place AND slug = ?
    `
		)
		.get(slug);
}

export function addPlace(name, slug, description, address, image, price, city, user) {
	const place = db
		.prepare(
			`
		INSERT INTO places (name, slug, description, address, image, city, user)
		VALUES (?, ?, ?, ?, ?, ?, ?)
		`
		)
		.run(name, slug, description, address, image, city, user);

	db.prepare(
		`
		INSERT INTO rentals (price, rating, place)
		VALUES (?, 0, ?)
		`
	).run(price, place.lastInsertRowid);
}

export function deletePlace(placeSlug) {
	db.prepare(
		`
        DELETE FROM places WHERE slug = ?
    `
	).run(placeSlug);
}

export function getReviews(slug) {
	const place = getPlace(slug);
	return db
		.prepare(
			`
		SELECT reviews.id as r_id, * FROM reviews, users WHERE reviews.user = users.id AND place = ?
		`
		)
		.all(place.id);
}

export async function addReview(place, user, date, rating, comment) {
	await new Promise(resolve => setTimeout(resolve, 2000));
	db.prepare(
		`
		INSERT INTO reviews (date, rating, comment, place, user)
		VALUES (?, ?, ?, ?, ?)
		`
	).run(date, rating, comment, place, user);
}

export async function rentPlace(place, user) {
	await new Promise(resolve => setTimeout(resolve, 2000));
	db.prepare(
		`
		INSERT INTO stays (place, user, date_start, date_end)
		VALUES (?, ?, '2024-01-01', '2024-01-08')
		`
	).run(place, user);
}

export function deleteReview(review) {
	db.prepare(
		`
		DELETE FROM reviews WHERE id = ?
		`
	).run(review);
}

export function getReviewById(review) {
	return db
		.prepare(
			`
	SELECT * FROM reviews WHERE id = ?
	`
		)
		.get(review);
}

export function hidePlace(placeSlug) {
	db.prepare(
		`
		INSERT INTO hidden_places (slug)
		VALUES (?)
		`
	).run(placeSlug);
}

export function checkIfNotHidden(placeSlug) {
	const result = db
		.prepare(
			`
	SELECT COUNT(*) as count FROM hidden_places WHERE slug = ?
	`
		)
		.get(placeSlug);

	return result.count === 0;
}

export function showPlace(placeSlug) {
	db.prepare(
		`
		DELETE FROM hidden_places WHERE slug = ?
		`
	).run(placeSlug);
}
