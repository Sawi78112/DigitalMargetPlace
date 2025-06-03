import { redirect } from '@sveltejs/kit';

import type { LayoutLoad } from './$types';
import { getUserMe } from '$modules/auth';
import type { User } from '$lib/types';

export const load: LayoutLoad = async ({ url }) => {
	let user: User | undefined;

	try {
		user = await getUserMe();
		// eslint-disable-next-line unused-imports/no-unused-vars
	} catch (error) {}

	if (!user) redirect(303, '/login');

	const pathname = url.pathname;

	const needVerification =
		pathname.startsWith('/a') && !pathname.startsWith('/u/email-confirmation') && !user.verified_at;

	if (needVerification) redirect(303, '/u/email-confirmation');

	const segments = pathname.split('/').filter(Boolean);
	const lastSegment = segments[segments.length - 1] ?? '';
	const titleMap: Record<string, string> = {
		'': 'Dashboard'
	};

	const headerTitle =
		titleMap[lastSegment] ??
		lastSegment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

	return {
		user,
		headerTitle
	};
};
