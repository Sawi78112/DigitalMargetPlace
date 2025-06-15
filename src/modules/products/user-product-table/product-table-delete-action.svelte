<script lang="ts">
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';

	import { deleteProduct } from '..';
	import type { Product } from '$lib/types';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	type Props = {
		product: Product;
	};

	let { product, open = $bindable(false) }: Props & { open?: boolean } = $props();

	const client = useQueryClient();

	const deleteProductMutation = createMutation({
		mutationKey: ['delete-product'],
		mutationFn: deleteProduct,
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['product'] });
			open = false;
			toast.success('Product deleted');
		}
	});
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete your product and remove your data
				from our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={$deleteProductMutation.isPending}>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				disabled={$deleteProductMutation.isPending}
				onclick={() => $deleteProductMutation.mutate(product.id)}>Delete</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
