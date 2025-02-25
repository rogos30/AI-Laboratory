'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { useState } from 'react';
import { addReviewAction } from '@/app/actions/places';

export default function AddReview({ placeId, userId, totalReviews, totalRating }) {
	const [formState, formAction] = useFormState(addReviewAction, {});
	const [rating, setRating] = useState(3);

	const changeRatingHandler = event => {
		setRating(+event.target.textContent);
	};

	return (
		<div className='w-1/2 mx-auto mb-16 p-8 bg-white rounded-2xl flex justify-center'>
			<div>
				<h2 className='text-3xl font-semibold'>Podziel się doświadczeniem</h2>
				<form action={formAction} className='py-8 flex flex-col items-center gap-4'>
					<div className='flex flex-col items-center gap-4'>
						<label htmlFor='comment'>Komentarz</label>
						<input type='text' name='comment' className='p-2 border-secondary border-2 rounded-2xl' />
					</div>
					<div className='flex flex-col items-center gap-4'>
						<label htmlFor='date'>Data</label>
						<input type='date' name='date' className='p-2 border-secondary border-2 rounded-2xl' />
					</div>
					<div className='flex flex-col items-center gap-4'>
						<label htmlFor='rating'>Ocena</label>
						<input type='hidden' name='rating' value={rating} />
						<div className='flex gap-4'>
							<button
								type='button'
								className={
									rating === 1
										? 'py-2 px-4 bg-primary border-white border-2 rounded-2xl font-bold'
										: 'py-2 px-4 bg-white border-primary border-2 rounded-2xl font-bold'
								}
								onClick={changeRatingHandler}>
								1
							</button>
							<button
								type='button'
								className={
									rating === 2
										? 'py-2 px-4 bg-primary border-white border-2 rounded-2xl font-bold'
										: 'py-2 px-4 bg-white border-primary border-2 rounded-2xl font-bold'
								}
								onClick={changeRatingHandler}>
								2
							</button>
							<button
								type='button'
								className={
									rating === 3
										? 'py-2 px-4 bg-primary border-white border-2 rounded-2xl font-bold'
										: 'py-2 px-4 bg-white border-primary border-2 rounded-2xl font-bold'
								}
								onClick={changeRatingHandler}>
								3
							</button>
							<button
								type='button'
								className={
									rating === 4
										? 'py-2 px-4 bg-primary border-white border-2 rounded-2xl font-bold'
										: 'py-2 px-4 bg-white border-primary border-2 rounded-2xl font-bold'
								}
								onClick={changeRatingHandler}>
								4
							</button>
							<button
								type='button'
								className={
									rating === 5
										? 'py-2 px-4 bg-primary border-white border-2 rounded-2xl font-bold'
										: 'py-2 px-4 bg-white border-primary border-2 rounded-2xl font-bold'
								}
								onClick={changeRatingHandler}>
								5
							</button>
						</div>
					</div>
					<input type='hidden' name='user' value={userId} />
					<input type='hidden' name='place' value={placeId} />
					<ShareBtn />
					{formState && formState.errors && JSON.stringify(formState.errors)}
				</form>
			</div>
		</div>
	);
}

function ShareBtn() {
	const status = useFormStatus();

	return (
		<button
			disabled={status.pending}
			className='w-1/2 mt-4 py-2 bg-secondary text-white uppercase font-semibold rounded-2xl'>
			{status.pending ? 'Udostępnianie...' : 'Udostępnij'}
		</button>
	);
}
