<script lang="ts">
	import { Loader2Icon } from 'lucide-svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';

	import type { Product } from '$lib/types';
	import { deleteProduct } from '..';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';

	type Props = {
		product: Product;
	};

	let { product }: Props = $props();

	let open = $state(false);

	const client = useQueryClient();

	const deleteProductMutation = createMutation({
		mutationKey: ['delete-product'],
		mutationFn: deleteProduct,
		onSuccess: () => {
			client.invalidateQueries({
				queryKey: ['product']
			});

			open = false;
			toast.success('Product deleted');
		}
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class="relative size-8 w-full p-0 {buttonVariants({ variant: 'ghost', size: 'icon' })}"
		onclick={() => (open = true)}
	>
		Delete
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Permanently Delete Product</Dialog.Title>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete the product and remove all of its
				data from our servers.
			</Dialog.Description>
		</Dialog.Header>

		<Dialog.Footer>
			<Button
				variant="outline"
				disabled={$deleteProductMutation.isPending || $deleteProductMutation.isPaused}
				onclick={() => (open = false)}>Cancel</Button
			>
			<Button
				variant="destructive"
				disabled={$deleteProductMutation.isPending || $deleteProductMutation.isPaused}
				onclick={() => $deleteProductMutation.mutate(product.id)}
			>
				{#if $deleteProductMutation.isPending || $deleteProductMutation.isPaused}
					<Loader2Icon class="mr-2 h-5 w-5 animate-spin" />
				{/if}
				Delete
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
