<script>
	import { onMount } from 'svelte';
	import Modal from './modal.svelte';
	import Spinner from './spinner.svelte';
	import Box from './box.svelte';
	import WatchList from './Finance/WatchList.svelte';
	import { watchList } from './Finance/storeWatchList';

	let quote = {};
	let symbol = '';
	let change = '';
	let isLoaded = true;
	let showModal = false;
	let isMinWait = true;

	$: fracHigh = quote && (quote.latestPrice / quote.week52High) * 100;

	// onMount(async () => {
	// 	try {
	// 		quote = await getQuote(symbol);
	// 	} catch (err) {
	// 		console.error('unable to get quote on mount');
	// 	}
	// });

	async function getQuote(symbol) {
		let data = null;
		try {
			const res = await fetch(`/stocks/quote/${symbol}`);
			console.log({ res });
			data = await res.json();
		} catch (err) {
			console.error('unable to fetch or parse', { res });
		}
		return data;
	}

	async function handleSubmit() {
		isLoaded = false;
		isMinWait = false;
		setTimeout(() => {
			isMinWait = true;
		}, 1000);
		console.log(symbol);
		try {
			const data = await getQuote(symbol);
			if (data) {
				quote = data;
				console.log({ quote, error: data.error });
				updateStats();
				isLoaded = true;
			}
		} catch (err) {
			console.error({ err });
		}
		console.log({ quote });
		symbol = '';
	}

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

	function addToWatchlist() {
		watchList.update(list => {
			console.log('list is', list);
			return [...list, quote];
		});
	}
</script>

<style type="text/scss">
	.quotes {
		display: flex;
		flex-direction: column;
		width: 100%;
		justify-items: center;
		align-content: center;
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

	form {
		padding: 2em;
	}
</style>

<div class="app-content">

	<h1>Stock Quote App</h1>

	<form on:submit|preventDefault={handleSubmit}>
		<label>Stock Name:</label>
		<input type="string" bind:value={symbol} />
	</form>

	<div class="quotes">
		{#if isLoaded && quote.symbol}
			<span class="quotes__head">{quote.companyName}</span>
			<span class="quotes__head2">{quote.primaryExchange}</span>
			<div class="quotes__row">
				{#each [['Close Price', quote.latestPrice], ['Percent of 52 Week High', fracHigh.toFixed(2)], ['Change', change]] as item}
					<span>{item[0]}</span>
					<span class="quotes__row--value">{item[1]}</span>
				{/each}
			</div>
			<button on:click={addToWatchlist} class="h-center">
				Add To Watch List
			</button>
		{:else if quote.symbol && !quote.error}
			<pre>LOADING</pre>
		{:else if quote.error}
			<pre>{quote.error}</pre>
		{/if}
		<WatchList />
	</div>
	<button on:click={() => (showModal = true)}>Open Modal</button>

</div>

{#if showModal}
	<Modal on:close={() => (showModal = false)}>
		<h2 slot="header">Stock Order</h2>
		<form>
			<label>Stock</label>
			<input type="text" />
		</form>
	</Modal>
{/if}
{#if !isLoaded || !isMinWait}
	<Spinner>
		<div>spinner</div>
	</Spinner>
{/if}
