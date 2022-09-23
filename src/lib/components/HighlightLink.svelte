<script lang="ts">
	export let url: string;
</script>

<a href={url}><slot>Click Here!</slot></a>

<style lang="scss">
	a {
		display: inline-flex;
		justify-content: center;
		align-items: center;

		padding: var(--gap-100) var(--gap-200);

		font-weight: 700;

		color: var(--fc-input-fg);

		border-radius: 10em;

		background: linear-gradient(
			to right,
			var(--fc-main-accent-fg),
			var(--fc-main-accent-secondary-fg)
		);
	}
</style>
