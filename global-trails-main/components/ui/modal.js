'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export function Modal({ children, onConfirm }) {
	const modalRef = useRef(null);
	const modalMount = useRef(null);
	const router = useRouter();
	const path = usePathname();
	const searchParams = useSearchParams();

	const handleResetSearchParams = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set('modal', 'close');
		newParams.delete('target');
		router.push(`${path}?${newParams}`, { scroll: false });
	};

	useEffect(() => {
		modalMount.current = document.getElementById('modal');
	}, []);

	useEffect(() => {
		if (modalRef.current) {
			if (searchParams.get('modal') === 'open') {
				modalRef.current.showModal();
			} else {
				modalRef.current.close();
			}
		}
	}, [searchParams]);

	const modalBody = (
		<dialog ref={modalRef} className='p-16' onClose={handleResetSearchParams}>
			{children}
			<form action={onConfirm} onSubmit={modalRef.current.close()}>
				<button>Confirm</button>
			</form>
		</dialog>
	);

	return modalMount.current ? createPortal(modalBody, modalMount.current) : null;
}

export function ModalBtn({ children, target }) {
	const router = useRouter();
	const path = usePathname();
	const searchParams = useSearchParams();

	const handleOpenModal = () => {
		const newParams = new URLSearchParams(searchParams);
		if (searchParams.get('modal') !== 'open') {
			newParams.set('modal', 'open');
		}
		router.push(`${path}?${newParams}&target=${target}`, { scroll: false });
	};

	return (
		<button onClick={handleOpenModal} className='p-16 bg-red-500'>
			{children}
		</button>
	);
}
