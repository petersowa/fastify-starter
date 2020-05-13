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
			overflow: hidden;
			grid-template-columns:
				repeat(4, minmax(3rem, 1fr)) minmax(0, 10rem)
				minmax(20px, 20px);
			grid-auto-rows: 2rem;
			gap: 10px 10px;
			border-bottom: 1px solid rgba(0, 0, 0, 0.2);
			padding: 0;
			align-items: center;
		}
		button {
			font-size: 16px;
			box-shadow: none;
			margin: 0;
		}
		.elipsis {
			display: inline-block;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			max-width: 100%;
		}
	}
</style>

<ul class="watchlist">
	{#each watchItems as quote}
		<li class="watchlist__row">
			<span>{quote.symbol}</span>
			<span>{quote.latestPrice}</span>
			<span>{(quote.changePercent * 100).toFixed(2)}</span>
			<span>
				{((quote.latestPrice / quote.week52High) * 100).toFixed(2)}
			</span>
			<span class="elipsis">
				{new Date(quote.latestUpdate).toLocaleString()}
			</span>
			<span>
				<button on:click={removeSymbol(quote.symbol)}>X</button>
			</span>
		</li>
	{/each}
</ul>
