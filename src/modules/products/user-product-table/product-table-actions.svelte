<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import { ProductTableDeleteAction } from '.';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import type { Product } from '$lib/types';
	import { goto } from '$app/navigation';

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
			<DropdownMenu.Item
				onclick={() => {
					goto(`/products/${product.id}/edit`);
				}}>Edit</DropdownMenu.Item
			>
			<DropdownMenu.Item onclick={() => (showDeleteAlert = true)}>Delete</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<ProductTableDeleteAction {product} bind:open={showDeleteAlert} />
