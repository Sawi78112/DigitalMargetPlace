<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { DashboardHeader } from '$lib/components/header';
	import { COUNTRIES } from '$modules/app';
	import Dropdown from '$lib/components/dropdown/dropdown.svelte';

	let selectedCountry = '';
	let agreedToTerms = false;
	let subscribedToEmails = false;

	let currentStep = 1;

	function handleNext() {
		if (selectedCountry && agreedToTerms) {
			currentStep = 2;
		}
	}
</script>

<DashboardHeader
	heading="Tax Information"
	description="Tax information refers to essential details related to an individual's or entity's tax obligations, filings, and compliance with government tax laws."
	backHref="/settings"
/>

<div class="my-6 flex items-center justify-center space-x-8">
	<div class="flex flex-col items-center">
		<div
			class="flex h-8 w-8 items-center justify-center rounded-full border font-medium transition-all duration-300"
			class:bg-blue-500={currentStep === 1}
			class:text-white={currentStep === 1}
			class:text-gray-400={currentStep !== 1}
			class:border-gray-300={currentStep !== 1}
		>
			01
		</div>
		<span class="mt-2 text-sm font-medium text-gray-600">Tax Information</span>
	</div>

	<div class="flex h-0.5 w-1/2">
		<div
			class="w-1/2 transition-all duration-300"
			class:bg-blue-500={currentStep === 1}
			class:border={currentStep !== 1}
		></div>
		<div
			class="w-1/2 transition-all duration-300"
			class:bg-blue-500={currentStep === 2}
			class:border={currentStep !== 2}
		></div>
	</div>

	<div class="flex flex-col items-center">
		<div
			class="flex h-8 w-8 items-center justify-center rounded-full border font-medium transition-all duration-300"
			class:bg-blue-500={currentStep === 2}
			class:text-white={currentStep === 2}
			class:text-gray-400={currentStep !== 2}
			class:border-gray-300={currentStep !== 2}
		>
			02
		</div>
		<span class="mt-2 text-sm font-medium text-gray-600">Certification</span>
	</div>
</div>

{#if currentStep === 1}
	<div class="space-y-4">
		<div class="flex-1">
			<div class="space-y-2">
				<Label class="font-medium">Country</Label>
				<Dropdown
					placeholder="your country"
					bind:selectedValue={selectedCountry}
					options={COUNTRIES}
				/>
			</div>

			<div class="mt-6 space-y-2 rounded-xl border p-4">
				<h2 class="text-base font-medium">E-mail Newsletters</h2>
				<div class="flex items-start gap-3">
					<Checkbox id="newsletter" bind:checked={subscribedToEmails} class="mt-0.5" />
					<Label
						for="newsletter"
						class="text-muted-foreground cursor-pointer text-sm leading-relaxed font-normal"
					>
						Send me tips, trends, freebies, updates, & offers. You can unsubscribe at any time.
					</Label>
				</div>
			</div>

			<div class="mt-6 space-y-2 rounded-xl border p-4">
				<h2 class="text-base font-medium">Terms & Conditions</h2>
				<div class="flex items-start gap-3">
					<Checkbox id="terms" bind:checked={agreedToTerms} class="mt-0.5" />
					<Label
						for="terms"
						class="text-muted-foreground cursor-pointer text-sm leading-relaxed font-normal"
					>
						<div>
							I have read and agree to the <a href="#" class="text-blue-600 underline"
								>Terms & Conditions</a
							>.
						</div>
					</Label>
				</div>
			</div>

			<div class="mt-6 flex justify-end gap-4">
				<Button variant="secondary" href="/settings">Cancel</Button>
				<Button disabled={!agreedToTerms} onclick={handleNext}>Next</Button>
			</div>
		</div>
	</div>
{/if}
