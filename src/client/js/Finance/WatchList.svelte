<script>
	import { get } from 'svelte/store';
	import { watchList } from './storeWatchList';
	let watchItems = [];

	const unsubscribe = watchList.subscribe(list => {
		console.log(list);
		watchItems = [...list];
	});
</script>

<style type="scss">
	.watchlist {
		display: flex;
		flex-direction: column;
		justify-content: left;
		margin: 0;
		width: 100%;
		outline: 1px solid red;
		padding: 0;
		&__row {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr 1fr;
			grid-auto-rows: 1.2rem;
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
