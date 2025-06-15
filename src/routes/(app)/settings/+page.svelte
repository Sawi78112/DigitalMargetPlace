<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import { ProfileForm, ProfilePasswordForm } from '$modules/profile/profile-form';
	import { reactiveQueryArgs } from '$lib/components/svelte-query';
	import { getProfileByUserId } from '$modules/profile/queries';
	import { getCurrentUser } from '$modules/auth';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';

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
	<Tabs.Root value="profile">
		<Tabs.List>
			<Tabs.Trigger value="profile">Profile</Tabs.Trigger>

			<Tabs.Trigger value="security">Security</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="profile">
			<Card.Root>
				<Card.Content>
					<ProfileForm {profile} {userId} />
				</Card.Content>
			</Card.Root>
		</Tabs.Content>

		<Tabs.Content value="security">
			<Card.Root>
				<Card.Content>
					<ProfilePasswordForm />
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>
