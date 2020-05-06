<script>
	import { get } from 'svelte/store';
	import { watchList } from './storeWatchList';
	let watchItems = [];

	const unsubscribe = watchList.subscribe(list => {
		console.log(list);
		watchItems = [...list];
		postWatchlist()
			.then(res => console.log({ watchlist: res }))
			.catch(err => console.error({ watchlist: err }));
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

	async function postWatchlist() {
		const csrf = document
			.querySelector('meta[name="csrf-token"]')
			.getAttribute('content');
		const response = await fetch(`/stocks/watchlist`, {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
				'csrf-token': csrf,
			},
			body: JSON.stringify(['ibm', 'csco']),
		});
		return response.json();
	}
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
