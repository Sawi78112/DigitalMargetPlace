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
	import { Label } from '$lib/components/ui/label';
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';

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
	id="edit-product-record-form"
	class="grid w-full grid-cols-4 gap-x-4 gap-y-4"
>
	<!-- <Label>Product Photos</Label>
	<Form.Field {form} name="product_photos" class="col-span-6">
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
					Upload Image <span class="text-gray-500">(0/10)</span>
				</p>
				<p class="mt-1 text-xs text-gray-500">Drag and drop your file here, or click to browse.</p>
				<Input
					id="productPhotos"
					type="file"
					name="productPhotos"
					multiple
					accept="image/*"
					class="absolute inset-0 cursor-pointer opacity-0"
				/>
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
			<Input type="number" bind:value={$formData.price} />
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

	<!-- <Label>Cover</Label>
	<Form.Field {form} name="cover" class="col-span-6">
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
					Upload Image <span class="text-gray-500">(0/10)</span>
				</p>
				<p class="mt-1 text-xs text-gray-500">Drag and drop your file here, or click to browse.</p>
				<Input
					id="productPhotos"
					type="file"
					name="productPhotos"
					multiple
					accept="image/*"
					class="absolute inset-0 cursor-pointer opacity-0"
				/>
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

	<div class="col-span-6 mt-2 mb-6 flex justify-end gap-3">
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
