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
	$: quotesInfo = [
		['Close Price', quote.latestPrice],
		['Market Cap', (quote.marketCap / 1000000000).toFixed(3) + 'B'],
		['PE', quote.peRatio],
		['Frac 52 Week High', fracHigh.toFixed(2)],
		['Change', change],
		[
			'Fac Score',
			quote.facScore.toFixed ? quote.facScore.toFixed(1) : 'not found',
		],
	];

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
		padding: 0.5em 1em;
		margin: 0;
		overflow: hidden;
		animation: slide-out 100ms ease;
		&__head {
			display: flex;
			justify-content: space-between;
			margin: 0 -1em;
			align-items: center;
			background-color: #00f1;
			&__title {
				font-size: 1rem;
				text-transform: capitalize;
				letter-spacing: 0.2rem;
				font-weight: bold;
				overflow: hidden;
				max-width: 70vw;
			}
		}
		&__head2 {
			text-align: center;
			font-size: 0.6rem;
			text-transform: uppercase;
			letter-spacing: 0.1rem;
			font-style: italic;
		}

		&__info {
			columns: 20rem;
			column-gap: 2em;
			margin-bottom: 1em;
			min-height: 4rem;
		}
		&__row {
			display: flex;
			justify-content: space-between;
			color: blue;
			flex-basis: 20rem;
			font-variant-numeric: tabular-nums;
			justify-items: left;
			margin: 0 auto;

			&--value {
				justify-self: right;
			}
		}
		&__controls {
			display: flex;
			flex-grow: 1;
			flex-direction: row;
			justify-content: flex-end;
			align-items: center;
			padding-right: 1em;
		}
	}
	.center-xy {
		display: flex;
		flex-direction: column;
		flex-grow: 2;
		justify-content: center;
		align-items: center;
		max-width: 80vw;
	}

	@keyframes slide-out {
		0% {
			height: 0px;
		}
		100% {
			height: 10em;
		}
	}
</style>

<div class="quotes">
	<div class="quotes__head">
		<div class="center-xy">
			<div class="quotes__head__title">{quote.companyName}</div>
			<div class="quotes__head2">{quote.primaryExchange}</div>
		</div>
		<div class="quotes__controls">
			<button on:click={addToWatchlist}>
				<Fa icon={faArrowAltCircleDown} color="green" size="2x" />
			</button>
		</div>
	</div>
	<div class="quotes__info">
		{#each quotesInfo as item}
			<div class="quotes__row">
				<span>{item[0]}</span>
				<span class="quotes__row--value">{item[1]}</span>
			</div>
		{/each}
	</div>
</div>
