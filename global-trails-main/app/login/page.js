import { LoginForm } from '@/components/auth/auth-form';
import Section from '@/components/ui/section';

export default function LoginPage() {
	return (
		<Section styles='translate-y-0'>
			<div className='w-1/2 mx-auto mb-16 p-8 bg-white rounded-2xl flex flex-col items-center'>
				<div>
					<h2 className='text-3xl font-semibold'>Witaj z powrotem!</h2>
				</div>
				<LoginForm />
			</div>
		</Section>
	);
}
