<script lang="ts">
	import { ProfilePasswordForm, ProfileForm } from '$modules/profile/profile-form';
	import { Separator } from '$lib/components/ui/separator';

	import { getProfileByUserId } from '$modules/profile/queries';
	import { createQuery } from '@tanstack/svelte-query';
	import { getCurrentUser } from '$modules/auth';
	import { reactiveQueryArgs } from '$lib/components/svelte-query';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card/index.js';

	const { user } = getCurrentUser();

	let userProfile = createQuery(
		reactiveQueryArgs(() => ({
			queryKey: ['user-profile', user.id],
			queryFn: () => getProfileByUserId(user.id)
		}))
	);

	let profile = $derived($userProfile.data);
	let userId = user.id;
</script>

<div class="space-y-4">
	<Tabs.Root class="border-none" value="profile">
		<div class="w-full">
			<Tabs.List class="flex justify-start gap-4 border-none bg-transparent px-2">
				<Tabs.Trigger
					class="border-0 text-lg font-medium outline-none hover:outline-none focus:outline-none active:outline-none"
					value="profile"
				>
					Profile
				</Tabs.Trigger>

				<Tabs.Trigger
					class="border-0 text-lg font-medium outline-none hover:outline-none focus:outline-none active:outline-none"
					value="security"
				>
					Security
				</Tabs.Trigger>
			</Tabs.List>
		</div>

		<Separator />

		<Tabs.Content value="profile">
			<Card.Root
				class="border-0 shadow-none outline-none hover:outline-none focus:outline-none active:outline-none"
			>
				<Card.Content class="space-y-2">
					<ProfileForm {profile} {userId} />
				</Card.Content>
			</Card.Root>
		</Tabs.Content>

		<Tabs.Content value="security">
			<Card.Root
				class="border-0 shadow-none outline-none hover:outline-none focus:outline-none active:outline-none"
			>
				<Card.Content class="space-y-2">
					<ProfilePasswordForm />
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>
