<script lang="ts">
	import { send } from '$lib/api';
	import type { ActionData } from './$types';
	import type { InvResponse, InvResponseType } from '$lib/actionResponse';
	import { enhance } from '$app/forms';

	// export let form: ActionData; // Sveltekit appears broken, ActionData is always 'unknown'
	export let form: (InvResponse<InvResponseType, boolean> & { success: true }) | undefined; // This is not type safe, but it will have to do...

	$: if (form) console.log('Recieved response:', form);
</script>

<form method="post" use:enhance>
	<div>
		<label for="username">Username</label>
		<input id="username" name="username" type="text" required />
	</div>

	<div>
		<label for="password">Password</label>
		<input id="password" name="password" type="password" value="" required />
	</div>

	{#if form?.type === 'id'}
		<p class="error">username {form?.values} already exists</p>
	{:else if 'type' in (form ?? {})}
		<p class="error">
			Error, sorry to lazy to tell you why.<!-- {generateResponseUIText(form)} -->
		</p>
	{/if}

	{#if form?.success}
		<p>Thank you for signing up!</p>
		<p><a href="/login">You can now log in.</a></p>
	{/if}

	<button type="submit">Sign Up</button>
</form>

<style>
	.error {
		color: tomato;
	}
</style>
