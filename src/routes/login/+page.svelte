<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	// export let form: ActionData;
	export let form: any;
</script>

<form method="post" use:enhance>
	<div>
		<label for="username">Username</label>
		<input id="username" name="username" type="text" required min="3" max="20" />
	</div>
	<div>
		<label for="password">Password</label>
		<input id="password" name="password" type="password" required />
	</div>
	<!-- <div>
		<label for="number">number</label>
		<input id="number" name="number" type="text" />
	</div> -->

	<button> Login </button>

	{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}

	<!-- {#if form?.success}
		<p>{JSON.stringify(form?.success)}</p>
	{/if} -->
</form>

<style>
	.error {
		color: tomato;
	}
</style>
