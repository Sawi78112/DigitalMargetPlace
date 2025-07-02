import type { SvelteComponent } from 'svelte';

import Google from './google.svelte';
import Apple from './apple.svelte';

export type Icon = SvelteComponent;

export const Icons = {
	google: Google,
	apple: Apple
};
