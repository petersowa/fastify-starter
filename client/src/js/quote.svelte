<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Spinner from './components/spinner.svelte';
	import WatchList from './Finance/components/WatchList.svelte';
	import { setSpinner } from './Finance/stores/stores';
	import { watchList } from './Finance/stores/WatchList';
	import {
		quotesStore,
		getQuote,
		refresh,
	} from './Finance/stores/QuotesStore';
	import { modalStore } from './Finance/stores/Modal';
	import Quote from './Finance/components/Quote.svelte';
	import Accounts from './Finance/components/Accounts.svelte';
	import {
		postWatchlist,
		getWatchlist,
		getStats,
	} from './Finance/handle-ajax';
	import EventBoard from './Finance/components/EventBoard.svelte';

	import { faSearch } from '@fortawesome/free-solid-svg-icons';
	import __qq from './utils/qq';
	import Icon from 'svelte-awesome';

	let quote: {
		facScore?: String;
		stats?: String;
		symbol?: String;
		error?: String;
	} = {};

	let symbol = '';
	let refreshInterval = null;
	let modal;

	__qq.log('ADD VISIBILITY CHANGE LISTENER');
	document.addEventListener(
		'visibilitychange',
		async () => {
			const { visibilityState } = document;
			__qq.log(document.visibilityState);
			if (visibilityState == 'visible' || refreshInterval === null) {
				await initRefresh();
				__qq.log('SET:', { refreshInterval });
			} else {
				clearInterval(refreshInterval);
				refreshInterval = null;
				__qq.log('CLEARED REFRESH');
			}
		},
		false
	);

	async function initRefresh() {
		const clearSpinner = setSpinner();
		await refreshWatchlist();
		clearSpinner();

		if (!refreshInterval) {
			__qq.log('SET REFRESH INTERVAL');
			refreshInterval = setInterval(() => {
				refreshWatchlist();
				refresh();
			}, 1000 * 60 * 10);
		}
	}

	onMount(async () => {
		await initRefresh();
		__qq.log('MOUNT:', { refreshInterval });

		const appTitle = document.getElementById('app-title');
		appTitle.innerHTML = 'GraniteCode.com - Investments';
	});

	const unsubscribeModalStore = modalStore.subscribe((store) => {
		modal = store.modal;
	});

	onDestroy(() => {
		unsubscribeModalStore();
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
							return await getQuote(sym);
						})
				);
				// await quotesStore.refresh();
				quotesStore.subscribe((data) =>
					__qq.log('quoteStore update', data)
				);
				watchList.update(() => {
					return [...quotes];
				});
			}
			__qq.log({ watchListItems });
		} catch (err) {
			__qq.log({ watchlistError: err });
		}
	}

	async function handleSubmit() {
		const clearSpinner = setSpinner();
		__qq.log(symbol);
		try {
			symbol = symbol.toUpperCase();
			const savedStats = JSON.parse(
				sessionStorage.getItem('stats:' + symbol)
			);
			const [data, stats] = await Promise.all([
				getQuote(symbol),
				savedStats || getStats(symbol),
			]);
			if (!savedStats && stats) {
				sessionStorage.setItem(
					'stats:' + symbol,
					JSON.stringify(stats)
				);
			}
			__qq.log({ stats });
			if (data) {
				quote = data;
				quote.facScore = stats.facScore || 'not found';
				quote.stats = stats;
				__qq.log({ quote, error: data.error });
				clearSpinner();
			}
		} catch (err) {
			__qq.error({ err });
		}
		__qq.log({ quote });
		symbol = '';
	}

	function addToWatchlist() {
		watchList.update((list) => {
			if (list.find((item) => item.symbol === quote.symbol)) return list;
			__qq.log('list is', list);

			const newList = [...list, quote];
			postWatchlist(newList.map((item) => item.symbol))
				.then((res) => __qq.log({ watchlist: res }))
				.catch((err) => __qq.error({ watchlist: err }));
			return newList;
		});
	}
</script>

<style lang="scss">
	.apps {
		font-size: calc(0.4em + 0.5vw);
	}

	.apps {
		display: flex;
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
		padding: 1em;
		& > button {
			margin: 10px;
		}
	}

	.app {
		background: #eee;
		margin: 0;
		border-radius: 0.2em;
	}

	.main {
		margin: 0;
		padding: 0.5em;
	}

	.attribution {
		position: fixed;
		width: fit-content;
		background: rgba(0, 0, 0, 0.2);
		color: white;
		right: 0;
		bottom: 0;
		padding: 0.5rem;
		border-radius: 0.5em;
		font-size: 0.8rem;
		margin: 0.2em;

		& > a {
			color: rgba(255, 255, 255, 0.5);
		}
	}
</style>

<div class="main">
	<div class="apps">
		<div class="app">
			{#if quote.symbol}
				<div class="app">
					<Quote {quote} {addToWatchlist} />
				</div>
			{:else if quote.error}
				<pre>{quote.error}</pre>
			{/if}
			<form on:submit|preventDefault={handleSubmit}>
				<label for="stock-name">Stock Name:</label>
				<input id="stock-name" type="string" bind:value={symbol} />
				<button type="submit">
					<Icon data={faSearch} />
				</button>
			</form>
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

<div class="attribution">
	<a href="https://iexcloud.io" rel="noreferrer" target="_blank"
		>Data provided by IEX Cloud</a
	>
</div>

<div class="version">
	<aside>
		<pre>20230206</pre>
	</aside>
</div>
<svelte:component this={modal.component} {...modal.data} />

<Spinner />
