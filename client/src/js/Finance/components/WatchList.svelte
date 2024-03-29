<script>
	import Sortable from 'sortablejs';
	import { onMount } from 'svelte';
	import { watchList } from '../stores/WatchList';
	import { postWatchlist } from '../handle-ajax';
	import Icon from 'svelte-awesome';
	import {
		faArrowsAlt,
		faMinusCircle,
		faPlusCircle,
	} from '@fortawesome/free-solid-svg-icons';

	let watchItems = [];

	const unsubscribe = watchList.subscribe((list) => {
		console.log('update subscription');
		watchItems = [...list];
	});

	onMount(() => {
		Sortable.create(document.getElementById('watchlist'), {
			handle: '.drag-handle',
			animation: 150,
			onSort: (e) => {
				reorderWatchlist(e.oldIndex, e.newIndex);
			},
		});
	});

	function removeSymbol(sym) {
		postWatchlist(
			watchItems
				.filter((item) => item.symbol !== sym)
				.map((item) => item.symbol)
		)
			.then((res) => {
				watchList.update((list) => {
					const newList = list.filter((item) => item.symbol !== sym);
					return newList;
				});
			})
			.catch((err) => console.log('UNABLE TO UPDATE WATCHLIST', err));
	}

	async function reorderWatchlist(fromIndex, toIndex) {
		if (fromIndex === toIndex) return;
		const moveItem = watchItems[fromIndex];
		const newList = watchItems.filter(
			(item) => item.symbol !== moveItem.symbol
		);
		newList.splice(toIndex, 0, moveItem);

		const orderedList = newList.map((item) => item.symbol);

		await postWatchlist(orderedList);
		watchList.update((list) => newList);
	}

	function changeColor(change) {
		return `rgba(${200 - change * 1000},${200 + change * 1000},${
			200 - Math.abs(change * 1000)
		},.4)`;
	}
</script>

<style lang="scss">
	.watchlist {
		display: grid;
		margin: 0;
		padding: 0;
		grid-template-columns: repeat(auto-fill, minmax(12em, 1fr));
		&__row {
			display: grid;
			position: relative;
			overflow: hidden;
			margin: 0;
			padding: 0;
			grid-template-columns: repeat(4, 1fr);
			grid-auto-rows: auto;
			grid-template-areas:
				'handle date date date'
				'symbol price . pe'
				'. changeDay . .'
				'. changeYear control control';
			/* gap: 10px 5px; */
			align-items: center;
			cursor: pointer;
			gap: 0.1em;
			background: var(--priceColor);
		}
		.grid-handle {
			grid-area: handle;
		}
		.grid-symbol {
			grid-area: symbol;
		}
		.grid-date {
			grid-area: date;
		}
		.grid-price {
			grid-area: price;
		}
		.grid-changeDay {
			grid-area: changeDay;
		}
		.grid-changeYear {
			grid-area: changeYear;
		}
		.grid-pe {
			grid-area: pe;
		}
		.grid-control {
			grid-area: control;
			justify-self: right;
			align-self: end;
		}
		button {
			box-shadow: none;
			margin: 0;
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
			padding: 0.1em 0.4em;
			margin: 2px;
			border-radius: 0.2em;
			user-select: none;
		}
		#price-change {
			position: relative;
			&:after {
				position: absolute;
				content: '';
				top: -0rem;
				right: -1rem;
				width: 5rem;
				bottom: -0rem;
				background: var(--priceColor);
			}
		}
		#price_52week-change {
			position: relative;
			&:after {
				position: absolute;
				content: '';
				top: -0rem;
				right: -1rem;
				width: 5rem;
				bottom: -0rem;
				background: var(--price52WeekColor);
			}
		}
		.drag-handle {
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0;
			height: 1.2em;
			width: 1.2em;
			cursor: grab;
			opacity: 0.8;
			background: rgba(0, 0, 0, 0.1);
			border-radius: 0.2em;
		}
		.btn-control {
			background: transparent;
			width: 1.5em;
			height: 1.5em;
			padding: 0;
			margin: 0;
		}
		.controls {
			display: flex;
			&:hover {
				outline: 1px solid red;
			}
		}
	}
</style>

<ul class="watchlist" id="watchlist">
	{#each watchItems as quote (quote.symbol)}
		<li
			data-sym={quote.symbol}
			class="watchlist__row"
			style="--priceColor:{changeColor(
				quote.changePercent
			)};--price52WeekColor:{changeColor(
				quote.latestPrice / quote.week52High - 0.9
			)}"
		>
			<div class="grid-handle drag-handle">
				<Icon data={faArrowsAlt} />
			</div>
			<span class="grid-symbol">{quote.symbol}</span>
			<span class="justify-right grid-price">
				{quote.latestPrice.toFixed(2)}
			</span>
			<span class="justify-right grid-changeDay" id="price-change">
				{(quote.changePercent * 100).toFixed(1)}
			</span>
			<span class="justify-right grid-pe">
				{quote.peRatio ? quote.peRatio.toFixed(1) : ''}
			</span>
			<span
				class="justify-right grid-changeYear"
				id="price_52week-change"
			>
				{((quote.latestPrice / quote.week52High - 1) * 100).toFixed(1)}
			</span>
			<span class="elipsis justify-right grid-date">
				{new Date(quote.latestUpdate).toLocaleString()}
			</span>
			<div class="grid-control">
				<span class="controls">
					<button
						class="btn-control"
						on:click={removeSymbol(quote.symbol)}
					>
						<Icon
							data={faMinusCircle}
							style="color: red; width: 1em; height: 1em;"
						/>
					</button>
					<button
						class="btn-control"
						on:click={removeSymbol(quote.symbol)}
					>
						<Icon
							data={faPlusCircle}
							style="color: blue; width: 1em; height: 1em;"
						/>
					</button>
				</span>
			</div>
		</li>
	{/each}
</ul>
