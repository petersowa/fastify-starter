<script>
	import { get } from 'svelte/store';
	import { watchList } from './storeWatchList';
	let watchItems = [];

	const unsubscribe = watchList.subscribe(list => {
		watchItems = [...list];
		console.log('watchlist subscribe list:', list);
	});

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
</script>

<style type="scss">
	.watchlist {
		display: flex;
		flex-direction: column;
		justify-content: left;
		margin: 0;
		width: 100%;
		padding: 1rem 0;
		&__row {
			display: grid;
			grid-template-columns: 0.5fr 0.5fr 0.5fr 1fr;
			grid-auto-rows: 1.2rem;
			overflow: hidden;
			gap: 10px 10px;
			border-bottom: 1px solid silver;
			padding: 0 2%;
		}
	}
</style>

<ul class="watchlist">
	{#each watchItems as quote}
		<li class="watchlist__row">
			<span>{quote.symbol}</span>
			<span>{quote.latestPrice}</span>
			<span>{quote.peRatio}</span>
			<span>{new Date(quote.latestUpdate).toLocaleString()}</span>
		</li>
	{/each}
</ul>
