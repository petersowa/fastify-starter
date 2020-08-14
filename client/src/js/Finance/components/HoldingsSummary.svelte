<script>
	export let holdingSummary = {};
</script>

<style lang="scss">
	.holdings-summary {
		display: flex;
		margin: 1em;
		margin-left: auto;
		// border-radius: 5px;
		// box-shadow: 3px 3px 10px 2px rgba(0, 0, 0, 0.1);
		// background-color: rgba(255, 255, 0, 0.1);
		// padding: 0.5em;
		flex-wrap: wrap;
		width: 60ch;
		max-width: 40%;
		& > * {
			flex-grow: 1;
			flex-basis: calc(calc(42ch - 100%) * 999);
			text-align: right;
			font-variant-numeric: tabular-nums;
			white-space: nowrap;
		}
	}
</style>

{#if holdingSummary}
	<div class="holdings-summary">
		<span>Value: {holdingSummary.value.toFixed(2)}</span>
		<span>Cost: {holdingSummary.cost.toFixed(2)}</span>
		<span>Gain: {holdingSummary.gain.toFixed(2)}</span>
	</div>
{/if}
