<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { Product } from '$lib/types';

	type Props = {
		product: Product;
	};

	let { product }: Props = $props();
	let open = $state(false);
</script>

<Button
	variant="ghost"
	size="icon"
	onclick={() => (open = true)}
	class="relative size-8 w-full p-0"
>
	View
</Button>

<Dialog.Root bind:open>
	<Dialog.Content class="max-h-screen overflow-y-auto p-6">
		<Dialog.Header>
			<Dialog.Title class="text-center text-xl font-semibold">Product Details</Dialog.Title>
			<Dialog.Description class="text-center text-gray-600">
				View the details of {product.name}
			</Dialog.Description>
		</Dialog.Header>

		<div class="mt-4 space-y-3">
			{#each [{ label: 'Name', value: product.name }, { label: 'Description', value: product.description }, { label: 'Categories', value: product.categories }] as field}
				<div class="columns-2 space-y-1">
					<p class="text-sm font-semibold text-gray-800">{field.label}</p>
					<p class="text-sm text-gray-600">{field.value}</p>
				</div>
			{/each}
		</div>

		<Dialog.Footer class="mt-6">
			<Button variant="outline" onclick={() => (open = false)}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
