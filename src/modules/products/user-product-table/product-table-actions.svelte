<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import { ProductTableDeleteAction, ProductTableEditAction } from '.';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import type { Product } from '$lib/types';
	import DropdownMenuItem from '$lib/components/ui/dropdown-menu/dropdown-menu-item.svelte';

	let { product }: { product: Product } = $props();

	let showDeleteAlert = $state(false);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button variant="ghost" size="icon" class="relative size-8 p-0">
			<Ellipsis class="size-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<ProductTableEditAction productId={product.id} />
			<Button
				variant="ghost"
				size="icon"
				class="relative size-8 w-full p-0"
				onclick={() => (showDeleteAlert = true)}>Delete</Button
			>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

{#if showDeleteAlert}
	<ProductTableDeleteAction {product} bind:open={showDeleteAlert} />
{/if}
