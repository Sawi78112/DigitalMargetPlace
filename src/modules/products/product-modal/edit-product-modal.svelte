<script lang="ts">
	import { LoaderIcon } from 'lucide-svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	import { Dropdown } from '$lib/components/dropdown';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	import { createQuery } from '@tanstack/svelte-query';

	import { getCategories, updateProduct, updateProductSchema } from '..';

	import type { Product } from '$lib/types';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { reactiveQueryArgs } from '$lib/components/svelte-query';

	type Props = {
		product: Product;
		productId: string;
	};

	let { product, productId }: Props = $props();

	const client = useQueryClient();

	const categoriesQuery = createQuery(
		reactiveQueryArgs(() => ({
			queryKey: ['categories'],
			queryFn: () => getCategories()
		}))
	);

	const categories = $derived($categoriesQuery.data ?? []);

	const categoryNames = $derived(categories.map((c) => c.name));

	const updateProductMutation = createMutation({
		mutationKey: ['update-product'],
		mutationFn: updateProduct,
		onSuccess: () => {
			client.invalidateQueries();
			toast.success('Product updated');
		}
	});

	const form = superForm(defaults(zod(updateProductSchema)), {
		SPA: true,
		validators: zodClient(updateProductSchema),
		id: `edit-product`,
		resetForm: false,
		onUpdate({ form }) {
			if (form.valid) {
				$updateProductMutation.mutate({
					id: productId,
					product: form.data
				});
			}
		}
	});

	const { form: formData, enhance } = form;

	$effect(() => {
		if (product) {
			$formData = {
				id: product.id,
				name: product.name,
				description: product.description,
				categories: product.categories ?? []
			};
		}
	});
</script>

<form method="POST" use:enhance>
	<div class="grid grid-cols-2 gap-4 px-4">
		<Form.Field {form} class="col-span-2" name="name">
			<Form.Control>
				<Form.Label>Name</Form.Label>
				<Input type="text" bind:value={$formData.name} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} class="col-span-2" name="description">
			<Form.Control>
				<Form.Label>Description</Form.Label>
				<Textarea bind:value={$formData.description} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="categories">
			<Form.Control>
				<Form.Label>Category</Form.Label>
				<Dropdown
					placeholder="Categories"
					bind:selectedValue={$formData.categories}
					options={categoryNames}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<Button variant="outline">Cancel</Button>
	<Button
		onclick={() => form.submit()}
		disabled={$updateProductMutation.isPending || $updateProductMutation.isPaused}
	>
		{#if $updateProductMutation.isPending || $updateProductMutation.isPaused}
			<LoaderIcon class="mr-1 h-4 w-4 animate-spin" />
		{/if}
		Save
	</Button>
</form>
