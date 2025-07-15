import { createQuery } from '@tanstack/svelte-query';
import { getUserMe } from '../queries';
import type { User } from '$lib/types';

export function useCurrentUser(initialData?: User) {
	return createQuery({
		queryKey: ['current-user'],
		queryFn: getUserMe,
		initialData,
		staleTime: 1000 * 60 * 5
	});
}
