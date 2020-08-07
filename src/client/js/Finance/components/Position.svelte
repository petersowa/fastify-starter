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
	import { deletePosition } from '../handle-ajax';

	export let position = null;
	export let onDelete;
	export let onUpdate;
	export let quote;

	$: value = quote
		? (position.quantity * quote.latestPrice).toFixed(2)
		: 'loading...';
	$: dollarGain = quote
		? (position.quantity * quote.latestPrice - position.cost).toFixed(2)
		: 'loading...';
</script>

<style type="text/scss" lang="scss" src="../../../styles/position.scss">

</style>

<span>{position.symbol.toUpperCase()}</span>
<span>{format(new Date(position.date), 'MM/dd/yyy')}</span>
<span class="right-justify">{position.quantity}</span>
<span class="right-justify">{position.cost.toFixed(2)}</span>
<span class="right-justify">{value}</span>
<span class="right-justify">{dollarGain}</span>
<div class="control">
	<button class="item-control" aria-label="edit" on:click={onUpdate}>
		<Fa icon={faEdit} color="blue" />
	</button>
	<button class="item-control" aria-label="delete" on:click={onDelete}>
		<Fa icon={faMinusCircle} color="red" />
	</button>
</div>
