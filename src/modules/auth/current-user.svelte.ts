import { getContext, setContext } from 'svelte';
import type { User } from '$lib/types';

export class CurrentUser {
	user: User;

	constructor(user: User) {
		this.user = user;
	}
}

const CURRENT_USER_KEY = Symbol('CurrentUser');

export function setCurrentUser(user: User) {
	const currentUser = new CurrentUser(user);
	setContext(CURRENT_USER_KEY, currentUser);
	return currentUser;
}

export function getCurrentUser() {
	return getContext<CurrentUser>(CURRENT_USER_KEY);
}
