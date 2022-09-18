<script lang="ts">
	import Login from 'svelte-material-icons/Login.svelte';

	let expanded = false;
	let focused = false;
	let hovered = false;

	let container: HTMLElement;

	function onFocusin() {
		focused = true;
	}
	function onFocusout(event: FocusEvent) {
		if (!(event.relatedTarget instanceof HTMLElement && container.contains(event.relatedTarget))) {
			focused = false;
			expanded = false;
		}
	}
</script>

<div
	on:pointerenter={() => (hovered = true)}
	on:pointerleave={() => (hovered = false)}
	on:focusin={onFocusin}
	on:focusout={onFocusout}
	bind:this={container}
>
	<button
		on:click={() => (expanded = !expanded)}
		aria-expanded={expanded}
		aria-haspopup="true"
		aria-controls="list"
	>
		<Login />
	</button>
	<ul id="list" class:visible={expanded || focused || hovered}>
		<li>
			<a href="/login">Login</a>
		</li>
		<li>
			<a href="/register">Register</a>
		</li>
	</ul>
</div>

<style lang="scss">
	div {
		height: min-content;

		position: relative;
	}

	ul {
		display: none;

		position: absolute;
		top: 100%;
		right: 0;

		margin: 0;
		padding: 0;
		padding-top: var(--gap-200);

		&.visible {
			display: block;
		}
	}
</style>
