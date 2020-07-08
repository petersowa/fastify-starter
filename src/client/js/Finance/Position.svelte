<script>
	import Fa from 'svelte-fa';
	import {
		faEdit,
		faBinoculars,
		faMinusCircle,
		faPlusCircle,
		faPlus,
	} from '@fortawesome/free-solid-svg-icons';
	import { format } from 'date-fns';
	import { deletePosition } from './handle-ajax';

	export let position = null;
	export let stockQuotes = null;
	export let handleDelete;
	export let handleUpdate;

	$: value =
		position.symbol in stockQuotes
			? (
					position.quantity * stockQuotes[position.symbol].latestPrice
			  ).toFixed(2)
			: 'loading...';
	$: dollarGain =
		position.symbol in stockQuotes
			? (
					position.quantity *
						stockQuotes[position.symbol].latestPrice -
					position.cost
			  ).toFixed(2)
			: 'loading...';
</script>

<style type="scss">
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
	.position {
		display: grid;
		grid-template-columns: 0.5fr 1fr 0.5fr 0.8fr 0.5fr 1fr 8em;
		grid-auto-rows: 1.8em;
		align-items: center;
		justify-items: right;
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
<span>{format(new Date(position.date), 'MM/dd/yyy')}</span>
<span class="right-justify">{position.quantity}</span>
<span class="right-justify">{position.cost.toFixed(2)}</span>
<span class="right-justify">{value}</span>
<span class="right-justify">{dollarGain}</span>
<div class="control">
	<button class="item-control" aria-label="edit" on:click={handleUpdate}>
		<Fa icon={faEdit} color="blue" />
	</button>
	<button class="item-control" aria-label="delete" on:click={handleDelete}>
		<Fa icon={faMinusCircle} color="red" />
	</button>
</div>
