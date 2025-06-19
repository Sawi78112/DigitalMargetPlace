<script lang="ts">
	import { SearchIcon, PencilIcon, CheckCircleIcon, GridIcon } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';
</script>

<div class="w-full px-6">
	<div class="mt-20 mb-12 w-full text-center">
		<h1 class="text-3xl font-semibold text-gray-900">Welcome to Gumroad!</h1>
	</div>

	<div class="relative mb-12 w-full">
		<Input
			type="text"
			placeholder="Search"
			class="w-full rounded-full border border-gray-300 bg-gray-100 py-2 pr-12 pl-4 text-sm text-gray-700 focus:ring-2 focus:ring-gray-400 focus:outline-none"
		/>
		<SearchIcon class="absolute top-1/2 right-6 h-5 w-5 -translate-y-1/2 text-gray-500" />
	</div>

	<div class="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
		<div
			class="flex flex-col items-center justify-center rounded-xl bg-gray-100 p-6 text-center transition hover:shadow"
		>
			<GridIcon class="mb-4 h-8 w-8 text-gray-400" />
			<span class="text-sm font-medium text-gray-700">Search</span>
		</div>

		<div
			class="flex flex-col items-center justify-center rounded-xl bg-gray-100 p-6 text-center transition hover:shadow"
		>
			<PencilIcon class="mb-4 h-8 w-8 text-pink-400" />
			<span class="text-sm font-medium text-gray-700">Publish</span>
		</div>

		<div
			class="flex flex-col items-center justify-center rounded-xl bg-gray-100 p-6 text-center transition hover:shadow"
		>
			<CheckCircleIcon class="mb-4 h-8 w-8 text-green-600" />
			<span class="text-sm font-medium text-gray-700">Answer</span>
		</div>
	</div>
</div>
