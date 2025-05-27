import { writable } from 'svelte/store';

export function reactiveQueryArgs<T>(cb: () => T) {
	const store = writable<T>();

	$effect.pre(() => {
		store.set(cb());
	});

	return store;
}
