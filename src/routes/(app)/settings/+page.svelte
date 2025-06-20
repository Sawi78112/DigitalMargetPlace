<script lang="ts">
	// import { createQuery } from '@tanstack/svelte-query';

	// import { ProfileForm, ProfilePasswordForm } from '$modules/profile/profile-form';
	// import { reactiveQueryArgs } from '$lib/components/svelte-query';
	// import { getProfileByUserId } from '$modules/profile/queries';
	// import { getCurrentUser } from '$modules/auth';
	// import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';

	// const { user } = getCurrentUser();

	// let userProfile = createQuery(
	// 	reactiveQueryArgs(() => ({
	// 		queryKey: ['user-profile', user.id],
	// 		queryFn: () => getProfileByUserId()
	// 	}))
	// );

	// let profile = $derived($userProfile.data);
	// let userId = user.id;
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
	<Card.Root class="bg-gray-100 p-4">
		<Badge class="mb-2 bg-white text-black">Incomplete</Badge>
		<h3 class="text-base font-semibold">Tax Information</h3>
		<p class="text-muted-foreground mb-4 text-sm">
			Get charged the right amount of tax on your earnings.
		</p>
		<Button>Complete Now</Button>
	</Card.Root>

	<Card.Root class="bg-gray-100 p-4">
		<Badge class="mb-2 bg-white text-black">Incomplete</Badge>
		<h3 class="text-base font-semibold">Payment Method</h3>
		<p class="text-muted-foreground mb-4 text-sm">
			Let us know where you would like your earnings paid.
		</p>
		<Button>Complete Now</Button>
	</Card.Root>

	<Card.Root class="bg-gray-100 p-4">
		<Badge class="mb-2 bg-white text-black">Incomplete</Badge>
		<h3 class="text-base font-semibold">Trader Declaration</h3>
		<p class="text-muted-foreground mb-4 text-sm">
			We need to understand if you're operating as Trader on our platform.
		</p>
		<Button>Complete Now</Button>
	</Card.Root>

	<Card.Root class="bg-gray-100 p-4">
		<Badge class="mb-2 bg-white text-black">Incomplete</Badge>
		<h3 class="text-base font-semibold">ID Check</h3>
		<p class="text-muted-foreground mb-4 text-sm">
			It is critical for us to confirm the identities of our authors.
		</p>
		<Button>Complete Now</Button>
	</Card.Root>
</div>

<!-- <Tabs.Root value="profile">
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
	</Tabs.Root> -->
