<script>
	import { onMount, onDestroy } from 'svelte';
	import Modal from './modal.svelte';
	import Spinner from './spinner.svelte';
	import Box from './box.svelte';
	import WatchList from './Finance/WatchList.svelte';
	import { watchList } from './Finance/storeWatchList';
	import Quote from './Finance/Quote.svelte';
	import Accounts from './Finance/Accounts.svelte';
	import { postWatchlist } from './Finance/handle-ajax';

	let quote = {};
	let symbol = '';
	let change = '';
	let isLoaded = true;
	let showModal = false;
	let isMinWait = true;
	let watchListItems = null;
	let refreshInterval = null;

	$: fracHigh = quote && (quote.latestPrice / quote.week52High) * 100;

	onMount(async () => {
		const clearSpinner = setSpinner();
		await refreshWatchlist();
		clearSpinner();
		refreshInterval = setInterval(() => refreshWatchlist(), 1000 * 60 * 15);
	});

	onDestroy(() => {
		clearInterval(refreshInterval);
	});

	async function refreshWatchlist() {
		try {
			const res = await fetch(`/stocks/watchlist`);
			console.log({ watchlist: res });
			watchListItems = await res.json();
			if (watchListItems) {
				console.log({ watchListItems });
				const quotes = await Promise.all(
					watchListItems
						.filter(sym => sym !== null)
						.map(async sym => {
							return await getQuote(sym);
						})
				);
				watchList.update(list => {
					console.log(quotes);
					return [...quotes];
				});
			}
			console.log({ watchListItems });
		} catch (err) {
			console.log({ watchlistError: err });
		}
	}

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

	function setSpinner() {
		isLoaded = false;
		isMinWait = false;
		setTimeout(() => {
			isMinWait = true;
		}, 1000);
		return () => {
			isLoaded = true;
		};
	}

	async function handleSubmit() {
		const clearSpinner = setSpinner();
		console.log(symbol);
		try {
			const data = await getQuote(symbol);
			if (data) {
				quote = data;
				console.log({ quote, error: data.error });
				updateStats();
				clearSpinner();
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
			if (list.find(item => item.symbol === quote.symbol)) return list;
			console.log('list is', list);

			const newList = [...list, quote];
			postWatchlist(newList.map(item => item.symbol))
				.then(res => console.log({ watchlist: res }))
				.catch(err => console.error({ watchlist: err }));
			return newList;
		});
	}
</script>

<style type="text/scss">
	.apps {
		display: flex;
		flex-direction: column;
		background: white;
		gap: 1rem;
	}
	form {
		padding: 2em;
	}

	.app {
		background: #eee;
		margin-bottom: 1em;
		border-radius: 0.2em;
		box-shadow: 4px 4px 12px 2px rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(0, 0, 0, 0.1);
	}
</style>

<div class="apps">

	<h1>Investments</h1>

	<div class="app">
		<form on:submit|preventDefault={handleSubmit}>
			<label>Stock Name:</label>
			<input type="string" bind:value={symbol} />
		</form>
	</div>

	{#if quote.symbol}
		<div class="app">
			<Quote {quote} {addToWatchlist} />
		</div>
	{:else if quote.error}
		<pre>{quote.error}</pre>
	{/if}

	<div class="app">
		<WatchList />
	</div>

	<div class="app">
		<Accounts />
	</div>

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
