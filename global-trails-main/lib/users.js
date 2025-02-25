import db from './db';

export function createUser(email, name, password) {
	const user = db
		.prepare(
			`
        INSERT INTO users (email, name, role, password)
        VALUES (?, ?, 'user', ?)
    `
		)
		.run(email, name, password);
	return user.lastInsertRowid;
}

export function getUsers() {
	return db
		.prepare(
			`
        SELECT * FROM users
        `
		)
		.all();
}

export function getUser(email) {
	return db
		.prepare(
			`
        SELECT * FROM users WHERE email = ?
        `
		)
		.get(email);
}

export function getUserById(userId) {
	return db
		.prepare(
			`
        SELECT * FROM users WHERE id = ?
        `
		)
		.get(userId);
}

export function hasRented(user, place) {
	const result = db
		.prepare(
			`
		SELECT COUNT(*) AS count FROM stays WHERE user = ? AND place = ?
		`
		)
		.get(user, place);

	return result.count > 0;
}
