import type { User } from '$lib/types';

export type AuthResults = {
	token: string;
	user: User;
};
