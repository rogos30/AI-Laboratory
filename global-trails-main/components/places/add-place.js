'use client';
import { useFormState } from 'react-dom';

import { addPlaceAction } from '@/app/actions/places';

export default function AddPlace({ userId }) {
	const [formState, formAction] = useFormState(addPlaceAction, {});

	return (
		<form action={formAction} className='py-8 flex flex-col items-center gap-4'>
			<div className='flex flex-col items-center gap-4'>
				<label htmlFor='name'>Nazwa</label>
				<input type='text' name='name' className='p-2 border-secondary border-2 rounded-2xl' />
			</div>
			<div className='flex flex-col items-center gap-4'>
				<label htmlFor='description'>Opis</label>
				<input type='text' name='description' className='p-2 border-secondary border-2 rounded-2xl' />
			</div>
			<div className='flex flex-col items-center gap-4'>
				<label htmlFor='address'>Adres</label>
				<input type='text' name='address' className='p-2 border-secondary border-2 rounded-2xl' />
			</div>
			<div className='flex flex-col items-center gap-4'>
				<label htmlFor='image'>Zdjęcie</label>
				<input type='text' name='image' className='p-2 border-secondary border-2 rounded-2xl' />
			</div>
			<div className='flex flex-col items-center gap-4'>
				<label htmlFor='city'>Miasto</label>
				<input type='text' name='city' className='p-2 border-secondary border-2 rounded-2xl' />
			</div>
			<div className='flex flex-col items-center gap-4'>
				<label htmlFor='price'>Cena</label>
				<input type='number' step='0.01' name='price' className='p-2 border-secondary border-2 rounded-2xl' />
			</div>
			<input type='hidden' name='user' value={userId} />
			<button className='w-1/2 mt-4 py-2 bg-secondary text-white uppercase font-semibold rounded-2xl'>Dodaj</button>
			{formState && formState.errors && JSON.stringify(formState.errors)}
		</form>
	);
}
