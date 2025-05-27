<script lang="ts">
	import { CircleAlert, LoaderIcon } from 'lucide-svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	import { createProduct, getCategories, newProductSchema, updateProduct } from '..';
	import type { Product } from '$lib/types';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Alert from '$lib/components/ui/alert';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { Dropdown } from '$lib/components/dropdown';
	import { reactiveQueryArgs } from '$lib/components/svelte-query';

	type Props = {
		product?: Product | null;
	};

	let { product }: Props = $props();

	const client = useQueryClient();

	const categoriesQuery = createQuery(
		reactiveQueryArgs(() => ({
			queryKey: ['categories'],
			queryFn: () => getCategories()
		}))
	);

	const categories = $derived($categoriesQuery.data ?? []);

	const categoryNames = $derived(categories.map((c) => c.name));

	const createProductMutation = createMutation({
		mutationKey: ['create-product'],
		mutationFn: createProduct,
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['product'] });
			toast.success('Product created');
		}
	});

	const updateProductMutation = createMutation({
		mutationKey: ['update-product'],
		mutationFn: updateProduct,
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['product'] });
			toast.success('Product updated');
		}
	});

	const form = superForm(defaults(zod(newProductSchema)), {
		SPA: true,
		validators: zodClient(newProductSchema),
		dataType: 'json',
		resetForm: false,
		onSubmit() {},
		onUpdate({ form }) {
			if (form.valid) {
				if (product) {
					$updateProductMutation.mutate({ ...form.data, id: product.id });
				} else {
					$createProductMutation.mutate(form.data);
				}
			}
		}
	});

	const { form: formData, enhance } = form;

	$effect(() => {
		if (product) {
			$formData = {
				name: product.name,
				description: product.description,
				category_ids: product.category_ids ?? []
			};
		}
	});
</script>

<form
	method="POST"
	use:enhance
	id="product-record-form"
	class="grid w-full grid-cols-4 gap-x-4 gap-y-2"
>
	<div class="col-span-4 text-xl font-semibold">Add Product</div>

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

	<Form.Field {form} name="category_ids">
		<Form.Control>
			<Form.Label>Category</Form.Label>
			<Dropdown
				placeholder="Select Categories"
				bind:selectedValue={$formData.category_ids}
				options={categoryNames}
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	{#if $createProductMutation.isPaused}
		<Alert.Root variant="destructive" class="mt-2">
			<CircleAlert class="h-4 w-4" />
			<Alert.Title>You are offline</Alert.Title>
			<Alert.Description>Please connect to the internet.</Alert.Description>
		</Alert.Root>
	{/if}
	{#if $createProductMutation.isError}
		<Alert.Root variant="destructive" class="mt-2">
			<CircleAlert class="h-4 w-4" />
			<Alert.Title>Something went wrong.</Alert.Title>
		</Alert.Root>
	{/if}
	<div class="col-span-4 flex justify-end">
		<Form.Button
			disabled={$createProductMutation.isPending ||
				$createProductMutation.isPaused ||
				$updateProductMutation.isPending ||
				$updateProductMutation.isPaused}
		>
			{#if $createProductMutation.isPending || $createProductMutation.isPaused || $updateProductMutation.isPending || $updateProductMutation.isPaused}
				<LoaderIcon class="mr-1 h-4 w-4 animate-spin" />
			{/if}

			{#if product}
				Update
			{:else}
				Submit
			{/if}
		</Form.Button>
	</div>
</form>
