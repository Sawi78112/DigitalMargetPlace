import config from '@huntabyte/eslint-config';

export default config({
	svelte: true,

	ignores: ['src/lib/components/ui/*', 'src/lib/utils.ts']
});
