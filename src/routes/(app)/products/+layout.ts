// +layout.ts
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
	const pathname = url.pathname;

	const segments = pathname.split('/').filter(Boolean);
	const lastSegment = segments[segments.length - 1];

	const titleMap: Record<string, { title: string; subtitle?: string }> = {
		products: { title: 'Products' },
		'add-new-product': {
			title: 'Add New Product',
			subtitle: 'To start selling, upload your product file (max 5GB).'
		}
	};

	const headerInfo = titleMap[lastSegment] ?? {
		title: lastSegment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
	};

	return {
		headerTitle: headerInfo.title,
		headerSubtitle: headerInfo.subtitle ?? null
	};
};
