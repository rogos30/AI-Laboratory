import { NextPageBtn, PrevPageBtn } from './offset-btn';

export default function Pagination({ offset }) {
	return (
		<div className='flex justify-center gap-16 font-semibold'>
			<PrevPageBtn />
			<NextPageBtn offset={offset} />
		</div>
	);
}
