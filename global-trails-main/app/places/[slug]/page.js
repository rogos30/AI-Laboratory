import { notFound } from 'next/navigation';
import Link from 'next/link';

import { getPlace, getReviews } from '@/lib/places';
import { verifyAuth } from '@/lib/auth';
import { hasRented } from '@/lib/users';

import Section from '@/components/ui/section';
import AddReview from '@/components/places/add-review';
import Hero from '@/components/ui/hero';
import ItemsList from '@/components/shared/items-list';
import RentPlace from '@/components/places/rent-place';
import ManagePlace from '@/components/places/manage-place';

export default async function PlacePage({ params }) {
	const auth = await verifyAuth();
	const place = getPlace(params.slug);
	const reviews = getReviews(params.slug);
	const canComment = auth.user ? hasRented(auth.user.id, place.id) : false;

	if (!place) {
		notFound();
	}

	return (
		<>
			<Hero image={place.image} alt={place.name} size='half'>
				<ManagePlace placeSlug={place.slug} />
			</Hero>
			<main>
				<Section>
					<div className='container mx-auto'>
						<header className='flex flex-col items-center gap-16'>
							<div className='flex flex-col items-center gap-4'>
								<p>
									{place.city}, {place.address}
								</p>
								<h2 className='mb-2 text-5xl font-extrabold text-secondary'>{place.name}</h2>
								<p className='text-xl'>{place.description}</p>
								<p className='text-xl border-b-4 border-primary'>{place.price} zł / doba</p>
							</div>
							{auth.user && <RentPlace place={place.id} user={auth.user.id} />}
							{!auth.user && (
								<Link href='/login' className='px-8 py-4 bg-secondary text-white uppercase font-semibold rounded-2xl'>
									Zaloguj się, aby móc wynająć to miejsce
								</Link>
							)}
						</header>
					</div>
					<div className='container mx-auto mt-16 p-16'>
						{canComment && (
							<AddReview
								placeId={place.id}
								userId={auth.user.id}
								totalReviews={reviews.length}
								totalRating={place.rating}
							/>
						)}
						<ItemsList type='review' items={reviews} styles='justify-center flex-wrap' />
					</div>
				</Section>
			</main>
		</>
	);
}
