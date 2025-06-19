<script lang="ts">
	import { NewHeader } from '$lib/components/new-header/index.js';
	import { reactiveQueryArgs } from '$lib/components/svelte-query/query.svelte.js';
	import { getProfileByUserId } from '$modules/profile/queries.js';
	import { createQuery } from '@tanstack/svelte-query';

	let userProfile = createQuery(
		reactiveQueryArgs(() => ({
			queryKey: ['user-profile'],
			queryFn: () => getProfileByUserId()
		}))
	);

	let profile = $derived($userProfile.data);

	let { data, children } = $props();
</script>

{#if profile}
	<NewHeader name={`${profile.first_name} ${profile.last_name}`} />
{:else}
	<div>Loading profile...</div>
{/if}

{@render children?.()}
