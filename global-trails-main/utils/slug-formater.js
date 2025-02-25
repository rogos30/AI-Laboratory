export function formatSlug(slug) {
	const letters = ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż', ' '];
	const replacement = ['a', 'c', 'e', 'l', 'n', 'o', 's', 'z', 'z', '-'];

	let result = slug.toLocaleLowerCase();

	for (let i = 0; i < letters.length; ++i) {
		result = result.replaceAll(letters[i], replacement[i]);
	}

	return result;
}

export function isImgUrl(url) {
	return /\.(jpg|jpeg|png|webp|avif|gif)$/.test(url);
}
