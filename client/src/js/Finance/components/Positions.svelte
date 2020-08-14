<script>
	import { accountStore, setSpinner } from '../stores';
	import BuyModal from '../modals/Buy.svelte';
	import Position from './Position.svelte';
	export let holding;
	export let stockQuotes;
	// export let modal;
	let modal = { component: null, data: null };
	import Fa from 'svelte-fa';
	import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

	function handlePositionDelete(position, holding) {
		return (e) => {
			accountStore.deletePosition(position._id, holding._id);
		};
	}

	function handlePositionUpdate(position, holding) {
		return (e) => {
			modal.component = BuyModal;
			modal.data = {
				handleData: (e, { position, formData, holding }) => {
					position.symbol = formData.symbol;
					position.purchaseDate = new Date(formData.date);
					position.quantity = formData.shares;
					position.cost =
						+formData.price * +formData.shares + +formData.fee;
					position.purchasePrice = +formData.price;
					position.fees = +formData.fee;
					accountStore.updatePosition(position, holding._id);
					modal.component = null;
				},
				position,
				holding,
				toggleModal: () => (modal.component = null),
			};
		};
	}

	function handlePositionAdd(holding) {
		console.log(modal);
		return (e) => {
			modal.component = BuyModal;
			modal.data = {
				handleData: (e, { position, formData, holding }) => {
					position.symbol = formData.symbol;
					position.purchaseDate = new Date(formData.date);
					position.quantity = formData.shares;
					position.cost =
						+formData.price * +formData.shares + +formData.fee;
					position.purchasePrice = +formData.price;
					position.fees = +formData.fee;
					accountStore.addPosition(position, holding._id);
					modal.component = null;
				},
				position: {},
				holding,
				toggleModal: () => (modal.component = null),
			};
		};
	}
</script>

<style lang="scss">
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

{#if holding}
	<li>
		<span>Positions</span>
	</li>
	<li class="position">
		<span>Symbol</span>
		<span>Date</span>
		<span class="right-justify">Quantity</span>
		<span class="right-justify">Cost</span>
		<span class="right-justify">Value</span>
		<span class="right-justify">$ Gain</span>
	</li>
	{#each holding.positions as position}
		<li class="position">
			{#if position}
				<Position
					{position}
					quote={stockQuotes[position.symbol]}
					onDelete={handlePositionDelete(position, holding)}
					onUpdate={handlePositionUpdate(position, holding)} />
			{/if}
		</li>
	{/each}

	<button
		class="item-control"
		aria-label="add position"
		on:click={handlePositionAdd(holding)}>
		<Fa icon={faPlusCircle} color="blue" />
	</button>

	<svelte:component this={modal.component} {...modal.data} />
{/if}
