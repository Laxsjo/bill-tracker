<script lang="ts">
	export let defaultValue = '';

	let value = '';

	$: {
		value = defaultValue;
		console.log('New defaultValue:', defaultValue);
	}
</script>

<div>
	Your Value:
	<input type="text" {value} />
</div>

<style lang="scss">
	div {
		margin-block: var(--gap-400);
	}
	span {
		width: fit-content;
		padding: var(--gap-100);

		color: var(--fc-input-fg);

		border-radius: var(--borderRadius-medium);

		background-color: var(--fc-input-bg);
	}
</style>
