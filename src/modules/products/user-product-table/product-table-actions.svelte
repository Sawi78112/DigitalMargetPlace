<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';

	import { ProductTableDeleteAction, ProductTableEditAction } from '.';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { Product } from '$lib/types';

	type Props = {
		product: Product;
	};

	let { product }: Props = $props();
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
			<ProductTableDeleteAction {product} />
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
