import '@tanstack/svelte-query';

import type { ApiError } from '$lib/types';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '@tanstack/svelte-query' {
	// eslint-disable-next-line ts/consistent-type-definitions
	interface Register {
		defaultError: ApiError;
	}
}

export {};
