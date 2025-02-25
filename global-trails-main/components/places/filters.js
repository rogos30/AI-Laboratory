import { CityLink } from './city-link';

export function PlacesFilter({ cities }) {
	return (
		<div className='w-[100px]'>
			<p className='border-b-2 border-black text-lg font-semibold'>Miasta</p>
			<ul className='py-4 flex flex-col gap-4'>
				{cities.map(city => (
					<CityLink key={city.id} city={city.slug} text={city.name} />
				))}
			</ul>
		</div>
	);
}

export function PlacesSorting() {
	return (
		<div className='w-[100px] text-right'>
			<p className='border-b-2 border-black text-lg font-semibold'>Miasta</p>
			<ul className='py-4 flex flex-col gap-4'>
				<li>test</li>
				<li>test</li>
				<li>test</li>
				<li>test</li>
				<li>test</li>
			</ul>
		</div>
	);
}
