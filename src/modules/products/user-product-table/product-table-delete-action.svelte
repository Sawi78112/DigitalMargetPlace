<script lang="ts">
	import { Loader2Icon } from 'lucide-svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';

	import { deleteProduct } from '..';
	import type { Product } from '$lib/types';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';

	type Props = {
		product: Product;
	};

	let { product, open = $bindable(true) }: Props & { open?: boolean } = $props();

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

{#if open}
	<Alert.Root class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div class="w-full max-w-lg rounded-lg bg-white p-6 text-center shadow-lg">
			<Alert.Title class="text-lg font-semibold">Permanently Delete Product</Alert.Title>
			<Alert.Description class="px-9 pb-6 pt-3 text-sm text-gray-700">
				This action cannot be undone. This will permanently delete the product and remove all of its
				data.
			</Alert.Description>

			<div class="flex justify-center gap-4">
				<Button
					variant="outline"
					onclick={() => (open = false)}
					disabled={$deleteProductMutation.isPending}
				>
					Cancel
				</Button>

				<Button
					variant="destructive"
					onclick={() => $deleteProductMutation.mutate(product.id)}
					disabled={$deleteProductMutation.isPending}
				>
					{#if $deleteProductMutation.isPending}
						<Loader2Icon class="mr-2 h-5 w-5 animate-spin" />
					{/if}
					Confirm
				</Button>
			</div>
		</div>
	</Alert.Root>
{/if}
