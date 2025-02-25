import Image from 'next/image';
import Link from 'next/link';

import { verifyAuth } from '@/lib/auth';
import { getUserById } from '@/lib/users';
import { checkIfNotHidden } from '@/lib/places';

import DeleteReview from '../places/delete-review';

export function CityCard({ name, slug, description, image }) {
	return (
		<Link href={`/places?city=${slug}`}>
			<li className='relative w-[450px] h-[300px] rounded-2xl overflow-hidden'>
				<Image src={`/cities${image}`} alt={name} fill style={{ objectFit: 'cover' }} />
				<div className='absolute size-full bg-black opacity-40'></div>
				<h3 className='absolute text-5xl  text-white uppercase left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
					{name}
				</h3>
			</li>
		</Link>
	);
}

export function PlaceCard({ name, slug, address, image, city, price, rating, role }) {
	const formattedImage = image.startsWith('/') ? `/cities${image}` : image;
	const hidden = !checkIfNotHidden(slug);
	const partialHidden = hidden && (role === 'admin' || role === 'moderator');

	if (hidden && !partialHidden) return null;

	return (
		<Link href={`/places/${slug}`} className={partialHidden ? 'opacity-50' : ''}>
			<li className='relative w-full p-8 flex gap-8 bg-white shadow-md rounded-2xl'>
				<div className='relative w-1/4 min-w-[300px] h-[200px]  rounded-2xl overflow-hidden'>
					<Image src={formattedImage} alt={name} fill style={{ objectFit: 'cover' }} />
				</div>
				<div className=' flex flex-col justify-between'>
					<div>
						<h3 className='text-2xl font-semibold text-secondary'>{name}</h3>
						<p>
							{city}, {address}
						</p>
					</div>
					<div>
						<p className='text-2xl font-semibold'>{price} zł / doba</p>
						<p className='text-xl'>{rating} / 5</p>
					</div>
				</div>
			</li>
		</Link>
	);
}

export async function ReviewCard({ id, r_id, date, rating, comment, user, name }) {
	const auth = await verifyAuth();
	const existingUser = auth.user ? getUserById(auth.user.id) : null;

	//auth.user - obecnie zalogowany użytkownik
	//user - autor komentarza
	const canDelete = existingUser ? (auth.user && auth.user.id === user) || existingUser.role === 'admin' : false;

	return (
		<li className='w-2/5 p-8 bg-white rounded-2xl flex flex-col gap-4'>
			<div>
				<div className='flex justify-between items-center'>
					<span className='text-xl font-semibold text-secondary'>{name}</span>
					<div className='flex items-center'>
						<span>{rating} / 5 </span>
						<span className='ml-2 material-symbols-outlined text-primary'>thumb_up</span>
					</div>
				</div>
				<p>{comment}</p>
			</div>
			<div className='text-stone-400'>
				<span>{date}</span>
				{canDelete && <DeleteReview reviewId={r_id} userId={auth.user.id} />}
			</div>
		</li>
	);
}
