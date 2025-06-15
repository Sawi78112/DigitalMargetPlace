<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import * as Select from '$lib/components/ui/select';

	type Props = {
		selectedValue: string;
		options: string[];
		placeholder: string;
		restProps?: SelectPrimitive.TriggerProps;
	};

	let { selectedValue = $bindable(), options, placeholder, restProps }: Props = $props();
</script>

<Select.Root
	type="single"
	onValueChange={(v) => {
		selectedValue = v;
	}}
>
	<Select.Trigger class="" {...restProps}>
		{#if selectedValue}
			<span>{selectedValue}</span>
		{:else}
			<span>Select {placeholder}</span>
		{/if}
	</Select.Trigger>
	<Select.Content class="max-h-96 overflow-y-auto">
		<Select.Group>
			{#each options as option (option)}
				<Select.Item value={option} label={option}>
					{option}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
