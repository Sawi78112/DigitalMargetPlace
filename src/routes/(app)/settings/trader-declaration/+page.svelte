<script>
	import { toast } from 'svelte-sonner';
	import { Info, Check } from 'lucide-svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { DashboardHeader } from '$lib/components/header';
	import { setUserTraderStatus } from '$modules/user';
	import { goto } from '$app/navigation';

	const client = useQueryClient();

	const setUserTraderStatusMutation = createMutation({
		mutationKey: ['trader-declaration'],
		mutationFn: setUserTraderStatus,
		onSuccess: () => {
			toast.success('Trader status updated successfully!');
			client.invalidateQueries();
			goto('/settings');
		}
	});

	let traderStatus = $state('');
	let disclaimerAccepted = $state(false);

	function handleDone() {
		if (traderStatus === 'trader') {
			$setUserTraderStatusMutation.mutate({ isTrader: true });
		} else if (traderStatus === 'non-trader') {
			$setUserTraderStatusMutation.mutate({ isTrader: false });
		}
	}
</script>

<DashboardHeader heading="Trader Status Declaration" backHref="/settings" />

<div class="space-y-4">
	<div class="flex-1">
		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Yes, I am a Trader -->
			<Card class="relative" onclick={() => (traderStatus = 'trader')}>
				<CardContent class="p-6">
					<div class="mb-4 flex items-center justify-between">
						<h3 class="text-lg font-medium">Yes, I am a Trader</h3>
						<RadioGroup bind:value={traderStatus} class="flex items-center">
							<div class="flex items-center space-x-2">
								<RadioGroupItem value="trader" id="trader" />
							</div>
						</RadioGroup>
					</div>

					<div class="mb-4">
						<p class="mb-4 text-sm font-medium text-gray-700">Select this if you:</p>
						<div class="space-y-3">
							{#each Array(4) as _, i}
								<div class="flex items-start gap-3">
									<Check class="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
									<span class="text-sm leading-relaxed text-gray-600">
										Regularly create and sell digital assets as a business activity
									</span>
								</div>
							{/each}
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- No, I am not a Trader -->
			<Card class="relative" onclick={() => (traderStatus = 'non-trader')}>
				<CardContent class="p-6">
					<div class="mb-4 flex items-center justify-between">
						<h3 class="text-lg font-medium">No, I am not a Trader</h3>
						<RadioGroup bind:value={traderStatus} class="flex items-center">
							<div class="flex items-center space-x-2">
								<RadioGroupItem value="non-trader" id="non-trader" />
							</div>
						</RadioGroup>
					</div>

					<div class="mb-4">
						<p class="mb-4 text-sm font-medium text-gray-700">Select this if you:</p>
						<div class="space-y-3">
							{#each Array(4) as _, i}
								<div class="flex items-start gap-3">
									<Check class="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
									<span class="text-sm leading-relaxed text-gray-600">
										Regularly create and sell digital assets as a business activity
									</span>
								</div>
							{/each}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>

		<!-- Disclaimer Checkbox -->
		<div class="mt-6 flex items-start gap-3">
			<Checkbox id="disclaimer" bind:checked={disclaimerAccepted} class="mt-0.5" />
			<Label
				for="disclaimer"
				class="text-muted-foreground flex cursor-pointer flex-col space-y-4 text-sm leading-relaxed font-normal"
			>
				<div>
					I, the undersigned, hereby declare my status as a Trader under [specify the relevant tax
					laws or criteria in your jurisdiction, such as IRS guidelines for U.S. traders or local
					tax authority]. I acknowledge the following: my engagement in the business of buying and
					selling securities, commodities, or other financial instruments as a regular part of my
					business activities. My trading activities are substantial, frequent, and carried out with
					the intent of generating income from short-term price movements.
				</div>
				<div>
					I understand that as a trader, I am not considered an investor, and I may be subject to
					different tax treatments, including the reporting of gains and losses under Mark-to-Market
					rules (if applicable), and/or other tax regulations specific to traders.
				</div>
			</Label>
		</div>

		<!-- Info Box -->
		<div class="mt-6 flex items-start gap-3 rounded-lg bg-blue-50 p-4">
			<Info class="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
			<p class="text-sm text-gray-700">
				By Confirming your status you declare that your selection accurately reflects your trader
				status on Gumroad Market and understand how this affects the visibility of your author
				information.
			</p>
		</div>
	</div>

	<div class="flex justify-end gap-4">
		<Button variant="secondary" href="/settings">Back</Button>
		<Button
			disabled={!traderStatus || !disclaimerAccepted || $setUserTraderStatusMutation.isPending}
			onclick={handleDone}>Done</Button
		>
	</div>
</div>
