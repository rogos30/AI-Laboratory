'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function CityLink({ city, text }) {
	const path = useSearchParams();
	const isActive = path.get('city') === city;

	return (
		<Link href={`/places?city=${city}`}>
			<ul className={isActive ? 'font-semibold' : ''}>{text}</ul>
		</Link>
	);
}
