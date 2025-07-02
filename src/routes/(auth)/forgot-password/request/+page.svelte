<!-- <script lang="ts">
	import { ForgotPasswordRequestForm } from '$modules/auth/forgot-password-request';
</script>

<main class="flex min-h-screen flex-col items-center justify-center gap-3">
	<ForgotPasswordRequestForm />
</main> -->

<script lang="ts">
	import { ForgotPasswordRequestForm } from '$modules/auth/forgot-password-request';
</script>

<div
	class="relative container h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<div class="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
		<div class="absolute inset-0 bg-[url('/img/dmp-bg.jpg')] bg-cover bg-right bg-no-repeat"></div>
	</div>

	<div class="flex min-h-screen items-center justify-center">
		<div class="w-full max-w-md">
			<ForgotPasswordRequestForm />
		</div>
	</div>
</div>
