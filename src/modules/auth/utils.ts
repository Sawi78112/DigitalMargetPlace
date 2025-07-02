import type { User } from '$lib/types';

export function urlRedirectForLoggedInUser(user: User | null): string {
	if (!user) return '/login';
	return '/home';
}
