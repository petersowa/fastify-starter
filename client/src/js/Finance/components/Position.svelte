<script>
	import Icon from 'svelte-awesome';
	import { faEdit, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
	import { format } from 'date-fns';
	import { deletePosition } from '../handle-ajax';

	export let position = null;
	export let onDelete;
	export let onUpdate;
	export let quote;

	const DEBUG = false;

	$: value = quote
		? (position.quantity * quote.latestPrice).toFixed(2)
		: 'loading...';
	$: dollarGain = quote
		? (position.quantity * quote.latestPrice - position.cost).toFixed(2)
		: 'loading...';
	$: change = quote
		? (DEBUG && console.log(quote)) ||
		  (
				position.quantity *
				quote.latestPrice *
				((quote.latestPrice - quote.previousClose) /
					quote.previousClose)
		  ).toFixed(2)
		: 'loading...';
</script>

<style type="text/scss">
	.control {
		display: flex;
		margin-top: 0;
		align-items: center;
		justify-content: space-evenly;
		padding: 0.2em 0;
		& > :not(:last-child) {
			margin-right: 8px;
		}
	}

	.right-justify {
		justify-self: right;
	}

	.item-control {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5em;
		height: 1.5em;
		margin: 0 0.1em;
		border: none;
		box-shadow: 0 0 0 0.2em transparent, 0 0 0.2em 0 var(--clr-dark);
		border-radius: 0.2em;
		padding: 0;
		color: var(--clr-dark);
		&:active {
			box-shadow: 0 0 0 0.2em var(--clr-white);
		}
	}
</style>

<span>{position.symbol.toUpperCase()}</span>
<span>{format(new Date(position.purchaseDate), 'MM/dd/yyy')}</span>
<span class="right-justify">{position.quantity}</span>
<span class="right-justify">{position.cost?.toFixed(2)}</span>
<span class="right-justify">{value}</span>
<span class="right-justify">{change}</span>
<span class="right-justify">{dollarGain}</span>
<div class="control">
	<button class="item-control" aria-label="edit" on:click={onUpdate}>
		<Icon data={faEdit} style="color: blue;" />
	</button>
	<button class="item-control" aria-label="delete" on:click={onDelete}>
		<Icon data={faMinusCircle} style="color: red;" />
	</button>
</div>
