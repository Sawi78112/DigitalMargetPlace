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
	let agreedToCertification = false;

	let currentStep = 1;

	function handleNext() {
		if (selectedCountry && agreedToTerms) {
			currentStep = 2;
		}
	}

	function handleBack() {
		currentStep = 1;
	}

	function handleDone() {}
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

{#if currentStep === 2}
	<div class="mt-6 space-y-2 rounded-xl bg-gray-100 p-4">
		<div class="text-lg font-semibold">Certification</div>

		<p>
			Under penalties of perjury, I declare that I have examined the information on this form and to
			the best of my knowledge and belief it is true, correct, and complete. I further certify under
			penalties of perjury that:
		</p>

		<ul class="list-disc space-y-2 pl-6">
			<li>
				I am the individual that is the beneficial owner (or am authorized to sign for the
				individual that is the beneficial owner) of all the income to which this form relates or am
				using this form to document myself for chapter 4 purposes;
			</li>
			<li>The person named on line 1 of this form is not a U.S. person;</li>
			<li>
				The income to which this form relates is:
				<ul class="list-[lower-alpha] space-y-1 pl-6">
					<li>
						not effectively connected with the conduct of a trade or business in the United States;
					</li>
					<li>
						effectively connected but is not subject to tax under an applicable income tax treaty;
						or
					</li>
					<li>the partner's share of a partnership's effectively connected income;</li>
				</ul>
			</li>
			<li>
				The person named on line 1 of this form is a resident of the treaty country listed on line 9
				of the form (if any) within the meaning of the income tax treaty between the United States
				and that country;
			</li>
			<li>
				For broker transactions or barter exchanges, the beneficial owner is an exempt foreign
				person as defined in the instructions.
			</li>
		</ul>

		<p>
			Furthermore, I authorize this form to be provided to any withholding agent that has control,
			receipt, or custody of the income of which I am the beneficial owner or any withholding agent
			that can disburse or make payments of the income of which I am the beneficial owner. I agree
			that I will submit a new form within 30 days if any certification made on this form becomes
			incorrect.
		</p>
		<p>
			The Internal Revenue Service does not require your consent to any provisions of this document
			other than the certifications required to establish your status as a non-U.S. individual and,
			if applicable, obtain a reduced rate of withholding.
		</p>
	</div>

	<div class="mt-6 space-y-2 rounded-xl border p-4">
		<div class="flex items-start gap-3">
			<Checkbox id="terms" bind:checked={agreedToCertification} class="mt-0.5" />
			<Label
				for="terms"
				class="text-muted-foreground cursor-pointer text-sm leading-relaxed font-normal"
			>
				<div>I have read and acknowledge the certification</div>
			</Label>
		</div>
	</div>

	<div class="flex justify-end gap-4">
		<Button variant="secondary" onclick={handleBack}>Back</Button>
		<Button disabled={!agreedToCertification} onclick={handleDone}>Done</Button>
	</div>
{/if}
