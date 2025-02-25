'use client';
import { rentPlaceAction } from '@/app/actions/places';
import { useFormState, useFormStatus } from 'react-dom';

export default function RentPlace({ user, place }) {
	const [formState, formAction] = useFormState(rentPlaceAction, {});

	return (
		<>
			<form action={formAction}>
				<input type='hidden' name='place' value={place} />
				<input type='hidden' name='user' value={user} />
				<RentBtn />
			</form>
			{formState && formState.errors && JSON.stringify(formState.errors)}
		</>
	);
}

function RentBtn() {
	const status = useFormStatus();

	return (
		<button disabled={status.pending} className='px-8 py-4 bg-secondary text-white uppercase font-semibold rounded-2xl'>
			{status.pending ? 'Wynajmowanie...' : 'Wynajmij'}
		</button>
	);
}
