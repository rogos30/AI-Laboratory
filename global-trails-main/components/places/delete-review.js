'use client';
import { useFormState } from 'react-dom';
import { deleteReviewAction } from '@/app/actions/places';

export default function DeleteReview({ reviewId, userId }) {
	const [formState, formAction] = useFormState(deleteReviewAction, {});

	return (
		<form action={formAction}>
			<input type='hidden' name='user' value={userId} />
			<input type='hidden' name='review' value={reviewId} />
			<button>Usuń</button>
			{formState && formState.errors && JSON.stringify(formState.errors)}
		</form>
	);
}
