<script>
	import { onMount } from 'svelte';

	let quote = {};
	let symbol = 'ibm';

	onMount(async () => {
		quote = await getQuote(symbol);
	});

	async function getQuote(symbol) {
		const res = await fetch(`/stocks/quote/${symbol}`);
		return await res.json();
	}

	async function handleSubmit() {
		console.log(symbol);
		quote = await getQuote(symbol);
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
	{#if quote.close}
		<pre>{quote.companyName}</pre>
		<pre>{quote.primaryExchange}</pre>
		<pre>Close Price: {quote.latestPrice}</pre>
	{:else}
		<pre>LOADING</pre>
	{/if}
</div>
