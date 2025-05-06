// src/lib/api.ts
import axios, { type AxiosError } from 'axios';
import Cookies from 'js-cookie';

import type { ApiError } from '$lib/types';
import { dev } from '$app/environment';
import { PUBLIC_API } from '$env/static/public';

// ----------------------------
// 1. Type Definitions
// ----------------------------
type ApiConfig = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	url: string;
	data?: unknown;
	params?: Record<string, unknown>;
	token?: string;
};

// ----------------------------
// 2. Axios Instance
// ----------------------------
const client = axios.create({
	baseURL: PUBLIC_API,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json'
	}
});

// ----------------------------
// 3. Request Interceptor (Auth)
// ----------------------------
client.interceptors.request.use((config) => {
	const token = Cookies.get('authentication_token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// ----------------------------
// 4. Response Interceptor (Error Handling)
// ----------------------------
client.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		// Handle 401 Unauthorized
		if (error.response?.status === 401) {
			Cookies.remove('authentication_token');
		}

		// Transform to ApiError format
		const apiError: ApiError = {
			message: 'An error occurred',
			status: error.response?.status || 500
		};

		if (error.response?.data) {
			const data = error.response.data as Record<string, unknown>;
			apiError.message = (data.error as string) || apiError.message;
			apiError.errors = data.errors as string[];
			apiError.fieldErrors = data.field_errors as Record<string, string>;
		}

		return Promise.reject(apiError);
	}
);

// ----------------------------
// 5. Core API Function
// ----------------------------
export async function api<TResponse>(config: ApiConfig): Promise<TResponse> {
	const { method, url, data, params, token } = config;

	// Use explicit token if provided
	const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

	try {
		const response = await client.request<TResponse>({
			method,
			url,
			data,
			params,
			headers
		});

		return response.data;
	} catch (error) {
		// Already transformed to ApiError by interceptor
		// eslint-disable-next-line no-throw-literal
		throw error as ApiError;
	}
}

// ----------------------------
// 6. Auth Utilities
// ----------------------------
export const auth = {
	setToken: (token: string, expires?: Date) =>
		Cookies.set('authentication_token', token, {
			secure: !dev,
			sameSite: 'strict',
			httpOnly: false,
			expires
		}),
	getToken: () => Cookies.get('authentication_token'),
	clearToken: () => Cookies.remove('authentication_token')
};
