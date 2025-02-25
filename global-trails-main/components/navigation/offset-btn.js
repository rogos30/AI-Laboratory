'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function NextPageBtn({ offset }) {
	const router = useRouter();
	const path = usePathname();
	const searchParams = useSearchParams();

	const handleNextPage = () => {
		const newParams = new URLSearchParams(searchParams);
		const prevOffset = searchParams.get('offset');

		if (!prevOffset) {
			newParams.append('offset', offset);
		} else {
			newParams.set('offset', offset);
		}

		router.push(`${path}?${newParams}`, { scroll: !prevOffset || prevOffset !== offset });
	};

	return (
		<button onClick={handleNextPage} className='uppercase'>
			Następna
		</button>
	);
}

export function PrevPageBtn() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handlePrevPage = () => {
		if (!searchParams.get('offset')) {
			return;
		}

		router.back();
	};

	return (
		<button onClick={handlePrevPage} className='uppercase'>
			Poprzednia
		</button>
	);
}
