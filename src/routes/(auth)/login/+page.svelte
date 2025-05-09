<script lang="ts">
	import { UserRoundIcon } from 'lucide-svelte';

	import { LoginForm } from '$modules/auth/login-form';
</script>

<div class="container relative flex h-screen items-center justify-center">
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col items-center gap-y-4 pt-10">
				<div class="rounded-full border bg-gray-50 p-4">
					<div class="rounded-full border bg-white p-3.5">
						<UserRoundIcon class="size-7 text-gray-500" />
					</div>
				</div>
				<div class="text-center">
					<div class="text-2xl font-semibold">Login to your account</div>
					<div class="text-gray-600">Enter your details to login</div>
				</div>
			</div>
			<LoginForm />
			<p class="px-8 text-center text-sm text-muted-foreground">
				By clicking continue, you agree to our
				<a href="/terms" class="underline underline-offset-4 hover:text-primary">
					Terms of Service
				</a>
				and
				<a href="/privacy" class="underline underline-offset-4 hover:text-primary">
					Privacy Policy
				</a>
				.
			</p>
		</div>
	</div>
</div>
