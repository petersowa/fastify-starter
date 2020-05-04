<script>
	import { get } from 'svelte/store';
	import { watchList } from './storeWatchList';
	let watchItems = [];

	const unsubscribe = watchList.subscribe(list => {
		console.log(list);
		watchItems = [...list];
	});
</script>

<ul class="watchlist">
	{#each watchItems as quote}
		<li>{quote.symbol}</li>
	{/each}
</ul>
