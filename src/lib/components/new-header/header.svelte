<script lang="ts">
	import { BellIcon, SearchIcon, MessageCircleIcon } from 'lucide-svelte';
	import Input from '../ui/input/input.svelte';

	export let name: string;
</script>

<header class="flex items-center gap-4 rounded-full bg-gray-100 px-4 py-2">
	<div class="relative flex-1">
		<Input
			type="text"
			placeholder="Real Estate"
			class="w-full rounded-full border border-gray-300 bg-white py-1.5 pr-10 pl-4 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-gray-400 focus:outline-none"
		/>
		<SearchIcon class="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
	</div>

	<div class="flex shrink-0 items-center gap-3">
		<div class="rounded-full bg-white p-2 shadow-sm hover:bg-gray-200">
			<BellIcon class="h-5 w-5 text-yellow-500" />
		</div>

		<div class="rounded-full bg-white p-2 shadow-sm hover:bg-gray-200">
			<MessageCircleIcon class="h-5 w-5 text-blue-500" />
		</div>

		<div class="flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
			<img src="/user.png" alt="User avatar" class="h-8 w-8 rounded-full object-cover" />
			<span class="text-sm font-medium text-gray-700">{name}</span>
		</div>
	</div>
</header>
