<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	type Props = {
		productId: string;
	};

	let { productId }: Props = $props();
</script>

<Button
	href={`/products/${productId}/edit-product`}
	variant="ghost"
	size="icon"
	class="relative size-8 w-full p-0"
>
	Edit
</Button>
