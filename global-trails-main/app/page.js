import { Suspense } from 'react';

import { getAllCities } from '@/lib/cities';

import Hero from '@/components/ui/hero';
import Section from '@/components/ui/section';
import ItemsList from '@/components/shared/items-list';

export default function HomePage() {
	const cities = getAllCities();

	return (
		<>
			<Hero image='./gdansk-hero.jpg' alt='Gdansk' size='full' />
			<main>
				<Section>
					<div className='container mx-auto'>
						<header className='text-center'>
							<h2 className='mb-2 text-5xl font-extrabold'>Poznaj urokliwe miasta</h2>
							<p className='text-xl'>Znajdź najciekawsze dla siebie miasto i pozwól sobie się w nim rozkochać</p>
						</header>
						<Suspense fallback={<p>Loading...</p>}>
							<ItemsList items={cities} type='city' styles='py-16 justify-center flex-wrap' />
						</Suspense>
					</div>
				</Section>
			</main>
		</>
	);
}
