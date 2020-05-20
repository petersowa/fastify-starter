<script>
	import Sortable from 'sortablejs';
	import { onMount, beforeUpdate } from 'svelte';
	import { get } from 'svelte/store';
	import { watchList } from './storeWatchList';
	import { postWatchlist } from './handle-ajax';
	let watchItems = [];
	$: priceColor = 'white';
	let dragElem = null;
	let dragOver = null;
	let dragPos = { x: 0, y: 0 };

	const unsubscribe = watchList.subscribe(list => {
		console.log('update subscription');
		watchItems = [...list];
	});

	onMount(() => {
		Sortable.create(document.getElementById('watchlist'), {
			handle: '.drag-handle',
			animation: 150,
			onSort: e => {
				reorderWatchlist(e.oldIndex, e.newIndex);
			},
		});
	});

	beforeUpdate(() => {
		console.log({ BeforeUpdate: watchItems });
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
			})
			.catch(err => console.log('UNABLE TO UPDATE WATCHLIST', err));
	}

	async function reorderWatchlist(fromIndex, toIndex) {
		if (fromIndex === toIndex) return;
		const moveItem = watchItems[fromIndex];
		const newList = watchItems.filter(
			item => item.symbol !== moveItem.symbol
		);
		newList.splice(toIndex, 0, moveItem);

		const orderedList = newList.map(item => item.symbol);

		await postWatchlist(orderedList);
		watchList.update(list => newList);
	}

	function changeColor(change) {
		return `rgba(${200 - change * 1000},${200 + change * 1000},${200 -
			Math.abs(change * 1000)},.4)`;
	}
	function handleDragStart(e) {
		// e.preventDefault();
		dragElem = e.target.parentNode;
		dragPos.x = e.clientX;
		dragPos.y = e.clientY;
		e.target.setPointerCapture(e.pointerId);
	}
	function moveDragElement(e, sym) {
		if (!sym || !dragElem) return;
		e.preventDefault();
		const rect = e.target.getBoundingClientRect();
		const dx = dragPos.x - e.clientX;
		const dy = dragPos.y - e.clientY;
		console.log(dragElem.style.top, dy);
		dragElem.style.top = -dy + 'px';
		dragElem.style.left = -dx + 'px';
	}
	function handleDragEnd(e) {
		// e.preventDefault();
		e.target.releasePointerCapture(e.pointerId);
		dragElem = null;
		dragOver = null;
	}
	function handleDragOver(e, sym) {
		e.preventDefault();
		if (dragElem) dragOver = sym;
	}
	function handleDrop(e) {
		e.preventDefault();
		const droppedOn =
			e.target.dataset.sym || e.target.parentNode.dataset.sym;
		const sym = dragElem.dataset.sym;
		if (sym === droppedOn) return;
		const rect = e.target.getBoundingClientRect();
		const isBefore = e.clientY - rect.top < (rect.bottom - rect.top) / 2;
		reorderWatchlist(dragElem.dataset.sym, droppedOn, isBefore);
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
			position: relative;
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
			user-select: none;
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
		.drag-over {
			outline: 4px solid darkgoldenrod;
		}
	}
</style>

<ul class="watchlist" id="watchlist">
	{#each watchItems as quote (quote.symbol)}
		<li
			data-sym={quote.symbol}
			class={dragOver === quote.symbol ? 'watchlist__row drag-over' : 'watchlist__row '}
			style="--priceColor:{changeColor(quote.changePercent)};--price52WeekColor:{changeColor(quote.latestPrice / quote.week52High - 0.9)}">
			<div class="drag-handle" />
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
			<div>
				<button on:click={removeSymbol(quote.symbol)}>X</button>
			</div>
		</li>
	{/each}
</ul>
