<script>
	import { onMount } from 'svelte';

	let quote = {};
	let symbol = '';
	let change = '';
	let isLoaded = false;

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
</script>

<style>
	.quotes {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	figure,
	img {
		width: 100%;
		margin: 0;
	}

	form {
		background: silver;
		padding: 2em;
	}
</style>

<h1>Stock Quote App</h1>

<form on:submit|preventDefault={handleSubmit}>
	<label>Stock Name:</label>
	<input type="string" bind:value={symbol} />
</form>

<div class="quotes">
	{#if isLoaded && quote.symbol}
		<pre>{quote.companyName}</pre>
		<pre>{quote.primaryExchange}</pre>
		<pre>Close Price: {quote.latestPrice}</pre>
		<pre>Percent of 52 Week High: {fracHigh.toFixed(1)}%</pre>
		<pre>Change: {change}%</pre>
	{:else if quote.symbol && !quote.error}
		<pre>LOADING</pre>
	{:else if quote.error}
		<pre>{quote.error}</pre>
	{/if}
</div>
