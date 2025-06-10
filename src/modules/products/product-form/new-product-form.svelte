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
	import { MultipleDropdown } from '$lib/components/dropdown';
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

	const form = superForm(defaults(zod(newProductSchema)), {
		SPA: true,
		validators: zodClient(newProductSchema),
		resetForm: true,
		onUpdate({ form }) {
			if (form.valid) {
				$createProductMutation.mutate(form.data);
			}
		}
	});

	const { form: formData, enhance } = form;

	$effect(() => {
		if (product) {
			$formData = {
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
	id="product-record-form"
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
		{#if $createProductMutation.isPaused}
			<Alert.Root variant="destructive" class="flex items-center gap-2">
				<CircleAlert class="h-5 w-5" />
				<div>
					<Alert.Title>You are offline</Alert.Title>
					<Alert.Description>Please connect to the internet.</Alert.Description>
				</div>
			</Alert.Root>
		{/if}

		{#if $createProductMutation.isError}
			<Alert.Root variant="destructive" class="flex items-center gap-2">
				<CircleAlert class="h-5 w-5" />
				<Alert.Title>Something went wrong.</Alert.Title>
			</Alert.Root>
		{/if}
	</div>

	<div class="col-span-4 mt-4 flex justify-end">
		<Form.Button
			disabled={$createProductMutation.isPending || $createProductMutation.isPaused}
			class="px-6 py-2"
		>
			{#if $createProductMutation.isPending || $createProductMutation.isPaused}
				<LoaderIcon class="mr-2 h-5 w-5 animate-spin" />
			{/if}
			Add
		</Form.Button>
	</div>
</form>
