<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import { Separator } from '$lib/components/ui/separator';
	import type { Product } from '$lib/types.js';
	import { EditProductForm } from '$modules/products/product-form';
	import { getProductById } from '$modules/products';

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
		<p class="text-muted-foreground text-sm">
			{product ? product.title : 'PRODUCT'}
		</p>
	</div>
	<Separator />

	{#if product}
		<EditProductForm {product} {productId} />
	{/if}
</div>
