<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { DashboardHeader } from '$lib/components/header';
	import { useCurrentUser } from '$modules/auth/hooks';

	const currentUser = useCurrentUser();

	const traderDeclarationComplete = $derived($currentUser.data?.is_trader !== null);
</script>

<DashboardHeader
	heading="Complete your profile"
	description="Complete your profile by filling in all the necessary details, such as your personal information, preferences, and interests, to help ensure that you get the most personalized experience and connect with others more effectively."
/>

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
		<Badge class="mb-2 bg-white text-black">
			{traderDeclarationComplete ? 'Completed' : 'Incomplete'}
		</Badge>
		<h3 class="text-base font-semibold">Trader Declaration</h3>
		<p class="text-muted-foreground mb-4 text-sm">
			We need to understand if you're operating as Trader on our platform.
		</p>
		<Button disabled={traderDeclarationComplete} href="/settings/trader-declaration">
			{traderDeclarationComplete ? 'Completed' : 'Complete Now'}
		</Button>
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
