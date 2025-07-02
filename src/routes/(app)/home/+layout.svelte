<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import { HomeHeader } from '$lib/components/home-header';
	import { reactiveQueryArgs } from '$lib/components/svelte-query/query.svelte.js';
	import { getProfileByUserId } from '$modules/profile';

	let userProfile = createQuery(
		reactiveQueryArgs(() => ({
			queryKey: ['user-profile'],
			queryFn: () => getProfileByUserId()
		}))
	);

	let profile = $derived($userProfile.data);

	let { children } = $props();
</script>

{#if profile}
	<HomeHeader name={`${profile.first_name} ${profile.last_name}`} />
{/if}

{@render children?.()}
