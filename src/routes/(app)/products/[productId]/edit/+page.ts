import { redirect } from '@sveltejs/kit';

import type { PageLoad } from './$types';
import { getUserMe } from '$modules/auth';

export const load: PageLoad = async ({ params }) => {
	const user = await getUserMe();
	if (!user) redirect(303, '/login');
	return {
		user,
		productId: params.productId
	};
};
