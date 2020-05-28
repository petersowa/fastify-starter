<script>
	import { onMount, onDestroy } from 'svelte';
	import Modal from './modal.svelte';
	import Spinner from './spinner.svelte';
	import Box from './box.svelte';
	import WatchList from './Finance/WatchList.svelte';
	import { watchList, appStore, setSpinner } from './Finance/stores';
	import Quote from './Finance/Quote.svelte';
	import Accounts from './Finance/Accounts.svelte';
	import {
		postWatchlist,
		getQuote,
		getWatchlist,
	} from './Finance/handle-ajax';

	let quote = {};
	let symbol = '';
	let change = '';
	let showModal = false;
	let watchListItems = null;
	let refreshInterval = null;
	let isLoaded = false;
	let isMinWait = false;

	$: fracHigh = quote && (quote.latestPrice / quote.week52High) * 100;

	appStore.subscribe(value => {
		(isLoaded = value.isLoaded), (isMinWait = value.isMinWait);
	});

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
			const watchListItems = await getWatchlist();
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
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		padding: 0;
	}
	form {
		padding: 2em;
		& > button {
			margin: 10px;
		}
	}

	.app {
		background: #eee;
		margin-bottom: 1em;
		border-radius: 0.2em;
		box-shadow: 4px 4px 12px 2px rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(0, 0, 0, 0.1);
	}

	.apps-title {
		position: relative;
		margin: 0.5rem 0;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		text-align: center;
		font-weight: 300;
		width: 100%;
		&:before {
			position: absolute;
			content: '';
			height: 0.1em;
			background-color: blue;
			width: 100%;
			left: 0;
			bottom: 0;
			opacity: 0.5;
		}
	}
</style>

<div class="apps">

	<h1 class="apps-title">Investments</h1>

	<div class="app">
		<form on:submit|preventDefault={handleSubmit}>
			<label>Stock Name:</label>
			<input type="string" bind:value={symbol} />
			<button type="submit">Get Quote</button>
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
	<Spinner />
{/if}
