<script lang="ts">
	import { SearchIcon } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input';
</script>

<div class="flex h-14 items-center gap-x-2 rounded-full bg-white px-2">
	<div class="relative flex-1">
		<Input placeholder="Search" class="bg-muted rounded-full" />

		<div class="absolute top-0 right-4 flex h-full flex-col items-center justify-center">
			<SearchIcon class="size-5" />
		</div>
	</div>

	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button {...props} size="icon" variant="ghost">
					<Avatar.Root>
						<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-40" align="end">
			<DropdownMenu.Label>My Account</DropdownMenu.Label>
			<DropdownMenu.Item onclick={() => goto('/logout')}>Logout</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
