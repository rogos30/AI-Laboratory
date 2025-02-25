import db from './db';

export function getAllCities() {
	return db.prepare(`SELECT * FROM cities`).all();
}

export function getCity(slug) {
	return db
		.prepare(
			`
        SELECT * FROM cities WHERE slug = ?
    `
		)
		.get(slug);
}

export default function getCityByName(city) {
	return db
		.prepare(
			`
	SELECT * FROM cities WHERE name = ?
	`
		)
		.get(city);
}
