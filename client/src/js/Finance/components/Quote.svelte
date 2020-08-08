<script>
	import { beforeUpdate } from 'svelte';
	import Fa from 'svelte-fa';
	import {
		faPlusCircle,
		faArrowAltCircleDown,
	} from '@fortawesome/free-solid-svg-icons';

	export let quote = {};
	export let addToWatchlist;
	let symbol = '';
	let change = '';

	$: fracHigh = quote && (quote.latestPrice / quote.week52High) * 100;

	beforeUpdate(updateStats);

	function updateStats() {
		const {
			latestPrice,
			previousClose,
			previousVolume,
			week52High,
			week52Low,
		} = quote;
		change = (
			((latestPrice - previousClose) / previousClose) *
			100
		).toFixed(2);
	}

	const formatData = (name, value) => {
		return `<span>${name}</span><span>${value}</span>`;
	};
</script>

<style type="text/scss">
	.quotes {
		display: flex;
		flex-direction: column;
		width: 100%;
		justify-items: center;
		align-content: center;
		padding: 2em 1em;
		&__head {
			text-align: center;
			font-size: 1.2rem;
			text-transform: capitalize;
			letter-spacing: 0.2rem;
			font-weight: bold;
		}
		&__head2 {
			text-align: center;
			font-size: 0.8rem;
			text-transform: uppercase;
			letter-spacing: 0.1rem;
			font-style: italic;
			margin-bottom: 1.5em;
		}
		&__row {
			display: grid;
			grid-template-columns: 2fr 1fr;
			grid-auto-rows: minmax(1.5rem, auto);
			color: blue;
			font-variant-numeric: tabular-nums;
			justify-items: left;
			margin: 0 0 2em;
			&--value {
				justify-self: right;
			}
		}
	}

	.h-center {
		margin: auto;
	}
</style>

<div class="quotes">
	<span class="quotes__head">{quote.companyName}</span>
	<span class="quotes__head2">{quote.primaryExchange}</span>
	<div class="quotes__row">
		{#each [['Close Price', quote.latestPrice], ['Percent of 52 Week High', fracHigh.toFixed(2)], ['Change', change]] as item}
			<span>{item[0]}</span>
			<span class="quotes__row--value">{item[1]}</span>
		{/each}
	</div>
	<button on:click={addToWatchlist} class="h-center">
		<Fa icon={faArrowAltCircleDown} color="green" size="2x" />
	</button>
</div>
