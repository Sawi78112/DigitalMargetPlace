<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import { createQuery } from '@tanstack/svelte-query';
	import type { Product } from '$lib/types.js';
	import { EditProductModal } from '$modules/products/product-modal/index.js';
	import { getProductById } from '$modules/products/queries.js';

	let { data } = $props();

	const productQuery = createQuery<Product>({
		queryKey: ['products', data.productId],
		queryFn: () => getProductById(data.productId)
	});

	const productId = data.productId;

	let product = $derived($productQuery.data);
</script>

<div class="space-y-4">
	<div>
		<p class="text-sm text-muted-foreground">
			{product ? product.name : 'PRODUCT'}
		</p>
	</div>
	<Separator />

	{#if product}
		<EditProductModal {product} {productId} />
	{/if}
</div>
