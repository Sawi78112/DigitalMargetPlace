import { redirect } from '@sveltejs/kit';

import type { PageLoad } from './$types';
import { getUserMe } from '$modules/auth';
import type { User } from '$lib/types';

export const load: PageLoad = async () => {
	let user: User | undefined;

	try {
		user = await getUserMe();
		// eslint-disable-next-line unused-imports/no-unused-vars
	} catch (error) {}

	if (user) {
		if (!user.verified_at) redirect(303, '/u/email-confirmation');
		else redirect(303, '/home');
	}
};
