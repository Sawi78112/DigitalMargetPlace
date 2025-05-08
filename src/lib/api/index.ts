import axios, { type AxiosError, type AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

import { dev } from '$app/environment';
import { PUBLIC_API } from '$env/static/public';

const TOKEN_KEY = 'token';
const COOKIE_OPTIONS = {
	secure: !dev,
	sameSite: 'strict' as const,
	httpOnly: false
};

type ApiError = {
	message: string;
	status: number;
};

type RequestConfig<TData> = {
	method: 'get' | 'delete' | 'post' | 'put' | 'patch';
	endpoint: string;
	data?: TData;
	token?: string;
};

// Axios instance
const instance = axios.create({
	baseURL: PUBLIC_API,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json'
	}
});

instance.interceptors.request.use(
	(config) => {
		const token = Cookies.get(TOKEN_KEY);
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

instance.interceptors.response.use(
	(response: AxiosResponse) => response,
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			Cookies.remove(TOKEN_KEY);
		}
		return Promise.reject(error);
	}
);

async function req<TResponse>({
	method,
	endpoint,
	data,
	token
}: RequestConfig<unknown>): Promise<TResponse> {
	try {
		const headers: Record<string, string> = {};
		if (token) {
			headers.Authorization = `${token}`;
		}

		const response = await instance({
			method,
			url: endpoint,
			data,
			headers
		});

		return response.data as TResponse;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const apiError: ApiError = {
				message: error.response?.data?.message || 'An unexpected error occurred',
				status: error.response?.status || 500
			};
			throw apiError;
		}
		throw new Error('An unexpected error occurred');
	}
}

function setAuthToken(token: string): void {
	Cookies.set(TOKEN_KEY, token, COOKIE_OPTIONS);
}

function getAuthToken(): string | undefined {
	return Cookies.get(TOKEN_KEY);
}

function removeAuthToken(): void {
	Cookies.remove(TOKEN_KEY);
}

const api = {
	get: <TResponse>(endpoint: string, token?: string) =>
		req<TResponse>({ method: 'get', endpoint, token }),

	delete: <TResponse>(endpoint: string, token?: string) =>
		req<TResponse>({ method: 'delete', endpoint, token }),

	post: <TResponse>(endpoint: string, data?: unknown, token?: string) =>
		req<TResponse>({ method: 'post', endpoint, data, token }),

	put: <TResponse>(endpoint: string, data?: unknown, token?: string) =>
		req<TResponse>({ method: 'put', endpoint, data, token }),

	patch: <TResponse>(endpoint: string, data?: unknown, token?: string) =>
		req<TResponse>({ method: 'patch', endpoint, data, token }),

	auth: {
		setToken: setAuthToken,
		getToken: getAuthToken,
		removeToken: removeAuthToken
	}
};

function delay<TData>(data: TData) {
	// eslint-disable-next-line no-console
	if (dev) console.log('delay', data);
	return new Promise((resolve) => setTimeout(resolve, 1000));
}

function pass<TData>(data: TData) {
	// eslint-disable-next-line no-console
	if (dev) console.log('pass', data);
	return new Promise((resolve) => setTimeout(resolve, 0));
}

export { api, getAuthToken, removeAuthToken, setAuthToken, delay, pass };
