export default function Hero({ children, image, alt, size }) {
	const height = size === 'full' ? 'h-[50vh]' : 'h-[25vh]';

	return (
		<section className={`relative ${height} px-4`}>
			<div className='relative size-full rounded-t-[2em] overflow-hidden'>
				<img src={image} alt={alt} className='size-full object-cover' />
				{children}
			</div>
		</section>
	);
}
