<script>
	import { onMount, onDestroy } from 'svelte';
	import Spinner from './components/spinner.svelte';
	import WatchList from './Finance/components/WatchList.svelte';
	import { setSpinner } from './Finance/stores/stores';
	import { watchList } from './Finance/stores/WatchList';
	import { quotesStore } from './Finance/stores/QuotesStore';
	import Quote from './Finance/components/Quote.svelte';
	import Accounts from './Finance/components/Accounts.svelte';
	import { postWatchlist, getWatchlist } from './Finance/handle-ajax';
	import Fa from 'svelte-fa';

	import { faSearch } from '@fortawesome/free-solid-svg-icons';

	let quote = {};
	let symbol = '';
	let refreshInterval = null;

	onMount(async () => {
		const clearSpinner = setSpinner();
		await refreshWatchlist();
		clearSpinner();
		refreshInterval = setInterval(() => {
			refreshWatchlist();
			quotesStore.refresh();
		}, 1000 * 60 * 10);

		const appTitle = document.getElementById('app-title');
		appTitle.innerHTML = 'GraniteCode.com - Investments';
	});

	onDestroy(() => {
		clearInterval(refreshInterval);
	});

	async function refreshWatchlist() {
		try {
			const watchListItems = await getWatchlist();
			if (watchListItems) {
				const quotes = await Promise.all(
					watchListItems
						.filter((sym) => sym !== null)
						.map(async (sym) => {
							return await quotesStore.getQuote(sym);
						})
				);
				// await quotesStore.refresh();
				quotesStore.subscribe((data) =>
					console.log('quoteStore update', data)
				);
				watchList.update(() => {
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
			const data = await quotesStore.getQuote(symbol.toUpperCase());
			if (data) {
				quote = data;
				console.log({ quote, error: data.error });
				clearSpinner();
			}
		} catch (err) {
			console.error({ err });
		}
		console.log({ quote });
		symbol = '';
	}

	function addToWatchlist() {
		watchList.update((list) => {
			if (list.find((item) => item.symbol === quote.symbol)) return list;
			console.log('list is', list);

			const newList = [...list, quote];
			postWatchlist(newList.map((item) => item.symbol))
				.then((res) => console.log({ watchlist: res }))
				.catch((err) => console.error({ watchlist: err }));
			return newList;
		});
	}
</script>

<style type="text/scss">
	.apps {
		// flex-grow: 1;
		// display: flex;
		// flex-direction: column;
		// padding: 0.8em 0;
		font-size: calc(0.4em + 0.5vw);
	}

	.apps {
		display: flex;
		// margin: 1em;
		// margin-left: auto;
		// border-radius: 5px;
		// box-shadow: 3px 3px 10px 2px rgba(0, 0, 0, 0.1);
		// background-color: rgba(255, 255, 0, 0.1);
		// padding: 0.5em;
		flex-wrap: wrap;
		max-width: 100%;
		gap: 0.5em;
		& > * {
			flex-grow: 1;
			flex-basis: calc(calc(800px - 100%) * 999);
			font-variant-numeric: tabular-nums;
			white-space: nowrap;
		}
	}

	.apps + .apps {
		margin-top: 1em;
	}
	form {
		padding: 2em;
		& > button {
			margin: 10px;
		}
	}

	.app {
		background: #eee;
		margin: 0;
		border-radius: 0.2em;
		// box-shadow: 4px 4px 12px 2px rgba(0, 0, 0, 0.2);
		// border: 1px solid rgba(0, 0, 0, 0.1);
	}

	.main {
		margin: 0;
		padding: 0.5em;
	}
</style>

<div class="main">
	<div class="apps">
		<div class="app">
			<form on:submit|preventDefault="{handleSubmit}">
				<label for="stock-name">Stock Name:</label>
				<input id="stock-name" type="string" bind:value="{symbol}" />
				<button type="submit">
					<Fa icon="{faSearch}" />
				</button>
			</form>
			{#if quote.symbol}
				<div class="app">
					<Quote {quote} addToWatchlist="addToWatchlist" />
				</div>
			{:else if quote.error}
				<pre>{quote.error}</pre>
			{/if}
		</div>
	</div>
	<div class="apps">

		<div class="app">
			<WatchList />
		</div>

		<div class="app">
			<Accounts />
		</div>
	</div>
</div>

<Spinner />
