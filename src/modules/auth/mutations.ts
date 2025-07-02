import type {
	EmailConfirmationSchema,
	ForgotPasswordRequestSchema,
	ForgotPasswordSchema,
	LoginSchema,
	OtpSchema,
	RegisterSchema
} from '.';
import { api } from '$lib/api';
import type { AuthResult, ForgotPasswordRequestResult, Otp } from '$lib/types';

export async function login(data: LoginSchema): Promise<AuthResult> {
	return await api<AuthResult>({
		url: '/login',
		method: 'POST',
		data
	});
}

export async function register(data: RegisterSchema): Promise<AuthResult> {
	return await api<AuthResult>({
		url: '/register',
		method: 'POST',
		data
	});
}

export async function forgotPasswordRequest(data: ForgotPasswordRequestSchema) {
	return await api<ForgotPasswordRequestResult>({
		url: '/forgot-password/request',
		method: 'POST',
		data
	});
}

export async function forgotPassword(data: Omit<ForgotPasswordSchema, 'confirmPassword'>) {
	const searchParams = new URLSearchParams(window.location.search);
	const id = searchParams.get('id');

	return await api({
		url: '/forgot-password',
		method: 'POST',
		data: {
			...data,
			id
		}
	});
}

export async function otp(data: OtpSchema) {
	return await api<Otp>({
		url: '/otp',
		method: 'POST',
		data
	});
}

export async function emailConfirmation(data: EmailConfirmationSchema) {
	return await api<AuthResult>({
		url: '/email-confirmation',
		method: 'POST',
		data: {
			...data
		}
	});
}

export async function emailConfirmationRequest() {
	return await api<AuthResult>({
		url: '/email-confirmation/request',
		method: 'POST'
	});
}
