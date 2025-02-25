import { hidePlaceAction, removePlaceAction, showPlaceAction } from '@/app/actions/admin';
import { verifyAuth } from '@/lib/auth';
import { checkIfNotHidden } from '@/lib/places';
import { getUserById } from '@/lib/users';

export default async function ManagePlace({ placeSlug }) {
	const auth = await verifyAuth();
	if (!auth || !auth.user) return null;

	const hidden = !checkIfNotHidden(placeSlug);
	const user = getUserById(auth.user.id);

	let options = null;
	if (user.role === 'admin') {
		options = (
			<div className='absolute top-4 left-4 flex gap-4 '>
				<form action={removePlaceAction}>
					<input type='hidden' name='place' value={placeSlug} />
					<button className='py-1 px-4 font-semibold bg-primary border-primary border-2 rounded-xl'>Usuń</button>
				</form>
				{!hidden && (
					<form action={hidePlaceAction}>
						<input type='hidden' name='place' value={placeSlug} />
						<button className='py-1 px-4 bg-white border-primary border-2 rounded-xl'>Ukryj</button>
					</form>
				)}
				{hidden && (
					<form action={showPlaceAction}>
						<input type='hidden' name='place' value={placeSlug} />
						<button className='py-1 px-4 bg-white border-primary border-2 rounded-xl'>Cofnij ukrycie</button>
					</form>
				)}
			</div>
		);
	} else if (user.role === 'moderator') {
		options = (
			<div className='absolute top-4 left-4 flex gap-4 '>
				{!hidden && (
					<form action={hidePlaceAction}>
						<input type='hidden' name='place' value={placeSlug} />
						<button className='py-1 px-4 bg-white border-primary border-2 rounded-xl'>Ukryj</button>
					</form>
				)}
				{hidden && (
					<form action={showPlaceAction}>
						<input type='hidden' name='place' value={placeSlug} />
						<button className='py-1 px-4 bg-white border-primary border-2 rounded-xl'>Cofnij ukrycie</button>
					</form>
				)}
			</div>
		);
	}

	return options;
}
