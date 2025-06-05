<script lang="ts">
	import { ProfilePasswordForm } from '$modules/profile/profile-form';
	import { Separator } from '$lib/components/ui/separator';
</script>

<div class="space-y-4">
	<div>
		<h3 class="text-lg font-medium">Profile</h3>
		<p class="text-sm text-muted-foreground">Update your details.</p>
	</div>
	<Separator />
	<ProfilePasswordForm />
</div>
