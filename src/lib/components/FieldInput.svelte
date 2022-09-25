<script lang="ts">
	import type { InputType } from '$lib/types';
	import _ from 'lodash';
	import Sync from 'svelte-material-icons/Sync.svelte';

	export let defaultValue = '';
	export let confidence: number | null = null;

	export let type: InputType = 'text';
	export let value = defaultValue;
	export let label = '';
	export let postfix: string | null = null;
	export let optional: boolean = false;

	let inputValue = value;
	let userEdited = false;
	let active = true;

	let input: HTMLInputElement;

	// $: if (defaultValue) {
	// 	console.log('Default Value:', defaultValue);

	// 	revert();
	// }

	// $: value = inputValue
	$: defaultValue, revert();

	$: if (active) {
		value = inputValue;
	} else {
		value = '';
	}
	// $: if (active && input.value !== value) input.value = value;

	function handleInput() {
		inputValue = input.value;

		userEdited = true;
	}

	export function revert() {
		inputValue = defaultValue;
		userEdited = false;
	}
</script>

<div class="main" class:userEdited class:active>
	{#if optional}
		<input type="checkbox" bind:checked={active} />
	{/if}
	<label>
		{label}
		<input {type} value={inputValue} on:input={handleInput} bind:this={input} />
	</label>
	{#if postfix !== null}
		<div class="postfix">
			{postfix}
		</div>
	{/if}

	{#if confidence !== null}
		<div class="confidence">
			Certainty:
			{_.round(confidence * 100)}%
		</div>
	{/if}
	<button on:click={revert} title="Revert value" aria-label="Revert value" type="button">
		<Sync color="currentcolor" />
	</button>
</div>

<style lang="scss">
	@use '../../lib/styles/mixins' as m;
	.main {
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		gap: var(--gap-200);

		position: relative;

		width: fit-content;
		// padding: var(--gap-100);

		border-radius: var(--borderRadius-medium);

		&.userEdited {
			.confidence {
				color: var(--fc-main-fg--irrelevant);
				text-decoration: line-through;
				font-style: italic;
			}
		}

		&:not(.active) {
			font-style: italic;

			&::after {
				content: '';

				pointer-events: none;

				position: absolute;
				inset: 0;

				border-radius: inherit;

				background-color: var(--fc-inactive-overlay);
			}
		}
	}

	input,
	.postfix {
		color: var(--fc-input-fg);
	}

	.confidence {
		color: var(--fc-main-fg--grey);
		font-size: 0.9em;
	}

	button {
		@include m.IconButton;
	}
</style>
