<script>
	import { get } from 'svelte/store';
	import { watchList } from './storeWatchList';
	import { postWatchlist } from './handle-ajax';
	let watchItems = [];

	const unsubscribe = watchList.subscribe(list => {
		watchItems = [...list];
		console.log('watchlist subscribe list:', list);
	});

	function removeSymbol(sym) {
		postWatchlist(
			watchItems
				.filter(item => item.symbol !== sym)
				.map(item => item.symbol)
		)
			.then(res => {
				watchList.update(list => {
					const newList = list.filter(item => item.symbol !== sym);
					return newList;
				});
				console.log('UPDATED WATCH LIST', res);
			})
			.catch(err => console.log('UNABLE TO UPDATE WATCHLIST', err));
	}
</script>

<style type="scss">
	.watchlist {
		display: flex;
		flex-direction: column;
		justify-content: left;
		margin: 0;
		padding: 1em 1em;
		width: 100%;
		&__row {
			display: grid;
			grid-template-columns: 0.5fr 0.5fr 0.5fr 1fr 20px;
			grid-auto-rows: 2rem;
			overflow: hidden;
			gap: 10px 10px;
			border-bottom: 1px solid rgba(0, 0, 0, 0.2);
			padding: 0;
			align-items: end;
		}
		button {
			font-size: 16px;
			box-shadow: none;
			margin: 0.2em;
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
			<span>
				<button on:click={removeSymbol(quote.symbol)}>X</button>
			</span>
		</li>
	{/each}
</ul>
