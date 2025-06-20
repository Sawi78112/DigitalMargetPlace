<script lang="ts">
	import { Header } from '$lib/components/header';
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

	let { data, children } = $props();
</script>

{#if profile}
	<Header
		name={`${profile.first_name} ${profile.last_name}`}
		title={data.headerTitle}
		subtitle="Complete your profile by filling in all the necessary details, such as your personal information, preferences, and interests, to help ensure that you get the most personalized experience and connect with others more effectively."
	/>
{:else}
	<div>Loading profile...</div>
{/if}
{@render children?.()}
