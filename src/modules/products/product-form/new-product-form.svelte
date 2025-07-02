<script lang="ts">
	import { CircleAlert, LoaderIcon } from 'lucide-svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';

	import { createProduct, getCategories, newProductSchema } from '..';
	import type { Product } from '$lib/types';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Alert from '$lib/components/ui/alert';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { MultipleDropdown } from '$lib/components/dropdown';
	import { reactiveQueryArgs } from '$lib/components/svelte-query';
	import { Label } from '$lib/components/ui/label';
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
	import { Button } from '$lib/components/ui/button';

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
				title: product.title,
				description: product.description,
				price: product.price,
				visibility: product.visibility,
				categories: product.categories ?? [],
				product_photos: product.product_photos ?? [],
				cover_photo: product.cover_photo ?? ''
			};
		}
	});
</script>

<form
	method="POST"
	use:enhance
	id="product-record-form"
	class="grid w-full grid-cols-6 gap-x-6 gap-y-6"
>
	<Label>Product Photos</Label>
	<!-- <Form.Field {form} name="product_photos" class="col-span-6">
		<Form.Control>
			<Label
				class="hover:bg-muted relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-12 text-center transition"
			>
				<img
					src="https://placehold.co/400"
					alt="Upload Icon"
					class="mx-auto h-20 w-20 text-blue-400"
				/>
				<p class="text-sm font-medium">
					Upload Image <span class="text-gray-500">({$selectedPhotosCount}/10)</span>
				</p>
				<p class="mt-1 text-xs text-gray-500">Drag and drop your file here, or click to browse.</p>
				<Input type="file" accept="image/*" multiple onchange={productPhotoFileToString} />
			</Label>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field> -->

	<Form.Field {form} name="title" class="col-span-4 sm:col-span-2">
		<Form.Control>
			<Form.Label>Title</Form.Label>
			<Input type="text" bind:value={$formData.title} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="price" class="col-span-4 sm:col-span-2">
		<Form.Control>
			<Form.Label>Price</Form.Label>
			<Input type="number" step="0.01" bind:value={$formData.price} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} class="col-span-4 sm:col-span-2" name="categories">
		<Form.Control>
			<Form.Label>Category</Form.Label>
			<MultipleDropdown
				placeholder="categories"
				bind:selectedValue={$formData.categories}
				options={categoryNames}
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Label>Cover</Label>
	<!-- <Form.Field {form} name="cover_photo" class="col-span-6">
		<Form.Control>
			<Label
				class="hover:bg-muted relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-12 text-center transition"
			>
				<img
					src="https://placehold.co/400"
					alt="Upload Icon"
					class="mx-auto h-20 w-20 text-blue-400"
				/>
				<p class="text-sm font-medium">Upload Cover Photo</p>
				<p class="mt-1 text-xs text-gray-500">Drag and drop your file here, or click to browse.</p>
				<Input type="file" accept="image/*" onchange={coverPhotoFileToString} />
			</Label>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field> -->

	<Form.Field {form} name="description" class="col-span-6">
		<Form.Control>
			<Form.Label>Description</Form.Label>
			<Textarea bind:value={$formData.description} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="visibility" class="col-span-6">
		<Form.Control>
			<Form.Label>Visibility</Form.Label>
			<RadioGroup bind:value={$formData.visibility} class="mt-2 flex flex-col gap-3">
				<div class="flex items-start space-x-3">
					<RadioGroupItem id="visible" value="visible" />
					<Label for="visible" class="flex flex-col">
						<p>
							<span class="font-medium">Visible</span> -
							<span class="text-muted-foreground text-sm">Everyone can see this content.</span>
						</p>
					</Label>
				</div>
				<div class="flex items-start space-x-3">
					<RadioGroupItem id="invisible" value="invisible" />
					<Label for="invisible" class="flex flex-col">
						<p>
							<span class="font-medium">Invisible</span> -
							<span class="text-muted-foreground text-sm"
								>Nobody except you can see this content.</span
							>
						</p>
					</Label>
				</div>
				<div class="flex items-start space-x-3">
					<RadioGroupItem id="unlisted" value="unlisted" />
					<Label for="unlisted" class="flex flex-col">
						<p>
							<span class="font-medium">Unlisted</span> -
							<span class="text-muted-foreground text-sm"
								>Only people with the direct link can see this. It won't be listed alongside other
								content on your store.</span
							>
						</p>
					</Label>
				</div>
			</RadioGroup>
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

	<div class="col-span-6 mt-2 mb-6 flex justify-end gap-3">
		<Button
			href="/products"
			class="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
		>
			Cancel
		</Button>

		<Form.Button
			disabled={$createProductMutation.isPending || $createProductMutation.isPaused}
			class="inline-flex items-center rounded-md  px-6 py-2 text-sm font-medium text-white transition disabled:opacity-50"
		>
			{#if $createProductMutation.isPending || $createProductMutation.isPaused}
				<LoaderIcon class="mr-2 h-5 w-5 animate-spin" />
			{/if}
			Add Product
		</Form.Button>
	</div>
</form>
