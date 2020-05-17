<script>
	import { get } from 'svelte/store';
	import { watchList } from './storeWatchList';
	import { postWatchlist } from './handle-ajax';
	let watchItems = [];
	$: priceColor = 'white';

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

	function changeColor(change) {
		return `rgba(${200 - change * 1000},${200 + change * 1000},${200 -
			Math.abs(change * 1000)},.4)`;
	}
</script>

<style type="scss">
	.watchlist {
		display: flex;
		flex-direction: column;
		justify-content: left;
		margin: 0;
		padding: 0;
		width: 100%;
		&__row {
			display: grid;
			overflow: hidden;
			grid-template-columns:
				minmax(2em, 2em) repeat(4, minmax(3rem, 1fr)) minmax(0, 12rem)
				minmax(2em, 2em);
			grid-auto-rows: 2rem;
			gap: 10px 5px;
			padding: 0;
			align-items: center;
			cursor: pointer;
		}
		button {
			font-size: 16px;
			box-shadow: none;
			margin: 0;
			color: red;
			background: #2222;
			text-align: center;
			width: 1.8em;
			height: 1.8em;
			padding: 0;
			border-radius: 0.2em;
		}
		.elipsis {
			display: inline-block;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			max-width: 100%;
		}
		.justify-right {
			text-align: right;
			font-variant-numeric: tabular-nums;
		}
		li {
			color: #222;
			box-shadow: 0px 0px 8px 2px #3334;
			padding: 0.1em 0.4em;
			margin: 2px;
			border-radius: 0.2em;
		}
		#price-change {
			position: relative;
			&:after {
				position: absolute;
				content: '';
				top: -0.3rem;
				right: -1rem;
				width: 5rem;
				bottom: -0.3rem;
				background: var(--priceColor);
			}
		}
		#price_52week-change {
			position: relative;
			&:after {
				position: absolute;
				content: '';
				top: -0.3rem;
				right: -1rem;
				width: 5rem;
				bottom: -0.3rem;
				background: var(--price52WeekColor);
			}
		}
		.drag-handle {
			color: blue;
			background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDQ4IDQ4IiBoZWlnaHQ9IjQ4cHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9IjQ4cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJMYXllcl80Ij48cG9seWdvbiBmaWxsPSIjMjQxRjIwIiBwb2ludHM9IjQ4LDI0IDQwLDE3IDQwLDIyIDI2LDIyIDI2LDggMzAuOTU4LDggMjQsMCAxNyw4IDIyLDggMjIsMjIgOCwyMiA4LDE3IDAsMjQgOCwzMSA4LDI2IDIyLDI2ICAgIDIyLDQwIDE3LjAzMSw0MCAyNCw0OCAzMC45NjksNDAgMjYsNDAgMjYsMjYgNDAsMjYgNDAsMzEgICIvPjwvZz48L3N2Zz4='),
				#2222;
			margin: 0;
			height: 1.5em;
			width: 1.5em;
			background-size: contain;
			cursor: grab;
		}
	}
</style>

<ul class="watchlist">
	{#each watchItems as quote}
		<li
			class="watchlist__row"
			style="--priceColor:{changeColor(quote.changePercent)};--price52WeekColor:{changeColor(quote.latestPrice / quote.week52High - 0.9)}"
			on:dragstart={e => console.log('drag start')}
			on:dragend={e => console.log('drag end')}>
			<div
				class="drag-handle"
				on:mousedown={e => {
					e.target.parentNode.setAttribute('draggable', 'true');
				}}
				on:mouseup={e => {
					e.target.parentNode.setAttribute('draggable', 'false');
				}} />
			<span>{quote.symbol}</span>
			<span class="justify-right">{quote.latestPrice.toFixed(2)}</span>
			<span class="justify-right" id="price-change">
				{(quote.changePercent * 100).toFixed(1)}
			</span>
			<span class="justify-right" id="price_52week-change">
				{((quote.latestPrice / quote.week52High - 1) * 100).toFixed(1)}
			</span>
			<span class="elipsis justify-right">
				{new Date(quote.latestUpdate).toLocaleString()}
			</span>
			<span>
				<button on:click={removeSymbol(quote.symbol)}>X</button>
			</span>
		</li>
	{/each}
</ul>
