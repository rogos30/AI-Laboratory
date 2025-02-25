import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getSliceOfPlaces } from '@/lib/places';
import { getAllCities } from '@/lib/cities';

import { PlacesFilter } from '@/components/places/filters';
import ItemsList from '@/components/shared/items-list';
import Pagination from '@/components/navigation/pagination';
import Section from '@/components/ui/section';

export default async function PlacesPage({ searchParams }) {
	const cities = getAllCities();
	const city = searchParams.city ? cities.find(city => city.slug === searchParams.city).name : null;
	const currentOffset = searchParams.offset ?? 0;
	const { places, offset } = getSliceOfPlaces(city, currentOffset);

	if (!places || places.length === 0) {
		notFound();
	}

	return (
		<Section styles='translate-y-0'>
			<div className='container mx-auto'>
				<header className='text-center'>
					<h2 className='mb-2 text-5xl font-extrabold'>Poznaj urokliwe miasta</h2>
					<p className='text-xl'>Znajdź najciekawsze dla siebie miasto i pozwól sobie się w nim rozkochać</p>
				</header>
				<section className='py-16 flex gap-16'>
					<PlacesFilter cities={cities} />

					<Suspense fallback={<p>Loading...</p>}>
						<ItemsList items={places} type='place' styles='p-16 pt-0 flex-col flex-grow bg-gray-white rounded-xl' />
					</Suspense>
				</section>
				<Pagination offset={offset} />
			</div>
		</Section>
	);
}
