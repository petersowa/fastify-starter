<script>
	import { accountStore } from '../stores/stores';
	import { quotesStore } from '../stores/QuotesStore';
	import { setModal, clearModal } from '../stores/Modal';
	import BuyModal from '../modals/Buy.svelte';
	import Position from './Position.svelte';
	import Fa from 'svelte-fa';
	import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

	export let holding;
	let stockQuotes = {};

	function handlePositionDelete(holding, position) {
		return (e) => {
			accountStore.deletePosition(position._id, holding._id);
		};
	}

	quotesStore.subscribe((data) => (stockQuotes = data.quote));

	function handleFormData(formData) {
		return {
			symbol: formData.symbol,
			purchaseDate: new Date(formData.date),
			quantity: formData.shares,
			cost: +formData.price * +formData.shares + +formData.fee,
			purchasePrice: +formData.price,
			fees: +formData.fee,
		};
	}

	function handlePositionUpdate(holding, currentPosition = null) {
		return (e) => {
			setModal({
				component: BuyModal,
				data: {
					handleData: (e, { position, formData, holding }) => {
						position = { ...position, ...handleFormData(formData) };
						if (currentPosition) {
							accountStore.updatePosition(position, holding._id);
						} else {
							accountStore.addPosition(position, holding._id);
						}
						clearModal();
					},
					position: currentPosition || {},
					holding,
					toggleModal: clearModal,
				},
			});
		};
	}
</script>

<style lang="scss">
	.position {
		display: grid;
		grid-template-columns: 0.5fr 1fr 0.5fr 0.8fr 0.5fr 0.8fr 0.8fr 8em;
		grid-auto-rows: 1.8em;
		align-items: center;
		justify-items: right;
	}
	.heading {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 0.2em;
		margin-left: -0.5em;
		margin-right: -0.5em;
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

{#if holding}
	<li class="position heading">
		<span>Symbol</span>
		<span>Date</span>
		<span>Quantity</span>
		<span>Cost</span>
		<span>Value</span>
		<span>Change</span>
		<span>$ Gain</span>
	</li>
	{#each holding.positions as position}
		<li class="position">
			{#if position}
				<Position
					{position}
					quote={position.symbol in stockQuotes && stockQuotes[position.symbol]}
					onDelete={handlePositionDelete(holding, position)}
					onUpdate={handlePositionUpdate(holding, position)} />
			{/if}
		</li>
	{/each}

	<button
		class="item-control"
		aria-label="add position"
		on:click={handlePositionUpdate(holding)}>
		<Fa icon={faPlusCircle} color="blue" />
	</button>
{/if}
