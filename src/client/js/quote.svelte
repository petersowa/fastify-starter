<script>
	import { onMount } from 'svelte';
	import Modal from './modal.svelte';
	import Box from './box.svelte';
	import ContactCard from './ContactCard.svelte';

	let quote = {};
	let symbol = '';
	let change = '';
	let isLoaded = false;
	let showModal = false;

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

	const formatData = (name, value) => {
		return `<span>${name}</span><span>${value}</span>`;
	};
</script>

<style type="text/scss">
	.quotes {
		display: flex;
		flex-direction: column;
		width: 100%;
		&__row {
			display: grid;
			grid-template-columns: 2fr 1fr;
			grid-auto-rows: minmax(1.5rem, auto);
			color: blue;
			padding: 0.5em;
			font-variant-numeric: tabular-nums;
			outline: 1px solid black;
			&--value {
				justify-self: right;
			}
		}
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
		<div class="quotes__row">
			{#each [['Close Price', quote.latestPrice], ['Percent of 52 Week High', fracHigh.toFixed(2)], ['Change', change]] as item}
				<span>{item[0]}</span>
				<span class="quotes__row--value">{item[1]}</span>
			{/each}
		</div>
	{:else if quote.symbol && !quote.error}
		<pre>LOADING</pre>
	{:else if quote.error}
		<pre>{quote.error}</pre>
	{/if}
</div>
<button on:click={() => (showModal = true)}>Add To Watch List</button>
<Box>
	<h2>Hello!</h2>
	<p>This is a box. It can contain anything.</p>
</Box>

<ContactCard>
	<span slot="name">P. Sherman</span>

	<span slot="address">
		42 Wallaby Way
		<br />
		Sydney
	</span>
</ContactCard>

{#if showModal}
	<Modal on:close={() => (showModal = false)}>
		<h2 slot="header">
			modal
			<small>
				<em>adjective</em>
				mod·al \ˈmō-dəl\
			</small>
		</h2>

		<ol class="definition-list">
			<li>of or relating to modality in logic</li>
			<li>
				containing provisions as to the mode of procedure or the manner
				of taking effect —used of a contract or legacy
			</li>
			<li>of or relating to a musical mode</li>
			<li>of or relating to structure as opposed to substance</li>
			<li>
				of, relating to, or constituting a grammatical form or category
				characteristically indicating predication
			</li>
			<li>of or relating to a statistical mode</li>
		</ol>

		<a href="https://www.merriam-webster.com/dictionary/modal">
			merriam-webster.com
		</a>
	</Modal>
{/if}
