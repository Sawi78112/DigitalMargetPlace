<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import { Header } from '$lib/components/header';
	import { reactiveQueryArgs } from '$lib/components/svelte-query/query.svelte.js';
	import { getProfileByUserId } from '$modules/profile';

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
	<Header
		name={`${profile.first_name} ${profile.last_name}`}
		title={data.headerTitle}
		subtitle={data.headerSubtitle}
	/>
{:else}
	<div>Loading profile...</div>
{/if}
{@render children?.()}
