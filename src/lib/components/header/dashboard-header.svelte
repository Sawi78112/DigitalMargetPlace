<script lang="ts">
	import { ArrowLeftIcon } from 'lucide-svelte';

	import { Button } from '$lib/components/ui/button';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type Props = HTMLAttributes<HTMLDivElement> & {
		heading: string;
		description?: string;
		backHref?: `/${string}`;
	};

	let {
		class: className,
		heading,
		description,
		children,
		backHref = '/home',
		...restProps
	}: Props = $props();
</script>

<div class={cn('flex items-center justify-between', className)} {...restProps}>
	<div class="flex items-start gap-x-4">
		<Button href={backHref} variant="secondary" class="rounded-full">
			<ArrowLeftIcon />
		</Button>
		<div class="space-y-1">
			<h3 class="text-xl font-semibold">{heading}</h3>
			{#if description}
				<p class="text-muted-foreground text-sm">
					{description}
				</p>
			{/if}
		</div>
	</div>
	{@render children?.()}
</div>
