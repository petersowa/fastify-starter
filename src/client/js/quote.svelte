<script>
	import { onMount } from 'svelte';

	let quote = {};
	let symbol = '';

	$: fracHigh = quote && (quote.latestPrice / quote.week52High) * 100;

	// onMount(async () => {
	// 	try {
	// 		quote = await getQuote(symbol);
	// 	} catch (err) {
	// 		console.error('unable to get quote on mount');
	// 	}
	// });

	async function getQuote(symbol) {
		const res = await fetch(`/stocks/quote/${symbol}`);
		let data;
		console.log({ res });
		try {
			data = await res.json();
		} catch (err) {
			console.error('unable to parse', { res });
		}
		return data;
	}

	async function handleSubmit() {
		console.log(symbol);
		try {
			const data = await getQuote(symbol);
			if (data) quote = data;
		} catch (err) {
			console.error({ err });
		}
		console.log({ quote });
		symbol = '';
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
	{#if quote && quote.symbol}
		<pre>{quote.companyName}</pre>
		<pre>{quote.primaryExchange}</pre>
		<pre>Close Price: {quote.latestPrice}</pre>
		<pre>Percent of 52 Week High: {fracHigh.toFixed(1)}%</pre>
	{:else}
		<pre>LOADING</pre>
	{/if}
</div>
