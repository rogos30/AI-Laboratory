import { verifyAuth } from '@/lib/auth';
import { CityCard, PlaceCard, ReviewCard } from '../ui/cards';
import { getUserById } from '@/lib/users';

export default async function ItemsList({ items, type, styles }) {
	const auth = await verifyAuth();
	const user = auth && auth.user ? getUserById(auth.user.id) : null;

	return (
		<ul className={`flex gap-8 ${styles}`}>
			{type === 'city' && items.map(item => <CityCard key={item.id} {...item} />)}
			{type === 'place' && items.map(item => <PlaceCard key={item.id} {...item} role={user ? user.role : undefined} />)}
			{type === 'review' && items.map(item => <ReviewCard key={item.id} {...item} />)}
		</ul>
	);
}
