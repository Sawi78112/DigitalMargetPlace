<script lang="ts">
	import { CircleAlert, LoaderIcon } from 'lucide-svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';

	import { getCategories, updateProduct, updateProductSchema } from '..';
	import { MultipleDropdown } from '$lib/components/dropdown';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';
	import type { Product } from '$lib/types';
	import { Textarea } from '$lib/components/ui/textarea';
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

<form
	method="POST"
	use:enhance
	id="edit-product-record-form"
	class="grid w-full grid-cols-4 gap-x-4 gap-y-4"
>
	<Form.Field {form} name="name" class="col-span-4 sm:col-span-2">
		<Form.Control>
			<Form.Label>Name</Form.Label>
			<Input type="text" bind:value={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="categories" class="col-span-4 sm:col-span-2">
		<Form.Control>
			<Form.Label>Category</Form.Label>
			<MultipleDropdown
				placeholder="Select Categories"
				bind:selectedValue={$formData.categories}
				options={categoryNames}
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="description" class="col-span-4 sm:col-span-2">
		<Form.Control>
			<Form.Label>Description</Form.Label>
			<Textarea bind:value={$formData.description} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<div class="col-span-4 mt-2 flex flex-col gap-2">
		{#if $updateProductMutation.isPaused}
			<Alert.Root variant="destructive" class="flex items-center gap-2">
				<CircleAlert class="h-5 w-5" />
				<div>
					<Alert.Title>You are offline</Alert.Title>
					<Alert.Description>Please connect to the internet.</Alert.Description>
				</div>
			</Alert.Root>
		{/if}

		{#if $updateProductMutation.isError}
			<Alert.Root variant="destructive" class="flex items-center gap-2">
				<CircleAlert class="h-5 w-5" />
				<Alert.Title>Something went wrong.</Alert.Title>
			</Alert.Root>
		{/if}
	</div>

	<div class="col-span-4 mt-4 flex justify-end gap-2">
		<Button variant="outline">Cancel</Button>
		<Button
			class="px-6 py-2"
			onclick={() => form.submit()}
			disabled={$updateProductMutation.isPending || $updateProductMutation.isPaused}
		>
			{#if $updateProductMutation.isPending || $updateProductMutation.isPaused}
				<LoaderIcon class="mr-2 h-5 w-5 animate-spin" />
			{/if}
			Save
		</Button>
	</div>
</form>
