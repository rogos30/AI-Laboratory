import { redirect } from 'next/navigation';

import { verifyAuth } from '@/lib/auth';
import AddPlace from '@/components/places/add-place';
import Section from '@/components/ui/section';

export default async function AddNewPlacePage() {
	const auth = await verifyAuth();

	if (!auth.session) {
		redirect('/places');
	}

	return (
		<Section styles='translate-y-0'>
			<div className='w-1/2 mx-auto mb-16 p-8 bg-white rounded-2xl flex flex-col items-center'>
				<div>
					<h2 className='text-3xl font-semibold'>Dodaj miejsce</h2>
				</div>
				<AddPlace userId={auth.user.id} />
			</div>
		</Section>
	);
}
