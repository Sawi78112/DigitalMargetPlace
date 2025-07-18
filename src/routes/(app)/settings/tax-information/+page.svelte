<script lang="ts">
	import { DashboardHeader } from '$lib/components/header';
	import { TaxInformationForm } from '$modules/user';
</script>

<DashboardHeader
	heading="Tax Information"
	description="Tax information refers to essential details related to an individual's or entity's tax obligations, filings, and compliance with government tax laws."
	backHref="/settings"
/>

<TaxInformationForm />
