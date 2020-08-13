<script>
	import Modal from '../../components/modal.svelte';
	import { get } from 'svelte/store';
	import { accountStore, setSpinner } from '../stores';
	import BuyModal from '../modals/Buy.svelte';
	import AccountModal from '../modals/Account.svelte';
	import Position from './Position.svelte';
	import { getQuote } from '../handle-ajax';
	import Fa from 'svelte-fa';
	import {
		faEdit,
		faBinoculars,
		faMinusCircle,
		faPlusCircle,
		faPlus,
	} from '@fortawesome/free-solid-svg-icons';

	let showAccount = null;
	let accountList = [];
	let stockQuotes = {};
	let modal = { component: null, data: null };
	let holdingSummary = {};

	function toggleAccountModal(holding = null) {
		showAccount = holding ? holding._id : null;
	}

	const unsubscribe = accountStore.subscribe(async (list) => {
		const quotes = {};
		if (!list || list.length === 0) return;
		const clearSpinner = setSpinner();
		try {
			accountList = list;
			console.log({ list });
			if (!accountList.holdings) throw new Error('no holdings');
			accountList.holdings.forEach((holding) => {
				holding.positions.forEach((position) => {
					if (position.symbol in quotes) return;
					quotes[position.symbol] = getQuote(position.symbol);
				});
			});

			const res = await Promise.all(Object.values(quotes));
			res.forEach((quote) => (stockQuotes[quote.symbol] = quote));

			accountList.holdings.forEach((holding) => {
				let cost = 0;
				let value = 0;
				holding.positions.forEach((position) => {
					cost += position.cost;
					value +=
						position.quantity *
						stockQuotes[position.symbol].latestPrice;
				});
				holdingSummary[holding.name] = {
					cost,
					value,
					gain: value - cost,
				};
			});

			clearSpinner();
		} catch (err) {
			console.error(err);
			clearSpinner();
		}
	});

	function handleBuyForm(e, { formData, account, holding, toggleModal }) {
		toggleModal();
		const newPosition = {
			symbol: formData.symbol,
			date: new Date(formData.date).toLocaleDateString(),
			purchaseDate: new Date(formData.date),
			quantity: formData.shares,
			cost: +formData.price * +formData.shares + +formData.fee,
			purchasePrice: +formData.price,
			gain: 0,
			dollarGain: 0,
			type: 'stock',
			fees: +formData.fee,
		};
		console.log({ holding });
		accountStore.addPosition(newPosition, holding._id);
	}

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

	function handleEditAccount() {
		modal.component = AccountModal;
		modal.data = {
			toggleModal: () => (modal.component = null),
			handleData: (e, { formData: { accountName } }) => {
				console.log({ accountName });
				if (typeof accountName == 'string' && accountName.length > 0) {
					accountStore.addHoldingsAccount(accountName);
				}
				modal.component = null;
			},
		};
	}

	const handleDeleteAccount = (holdingsId) => () => {
		if (holdingsId) {
			accountStore.deleteHoldingsAccount(holdingsId);
		}
	};
</script>

<style type="text/scss" lang="scss">
	.data {
		display: flex;
		flex-direction: column;
		justify-content: left;
		margin: 0;
		padding: 1em 1em;
		width: 100%;
		&__row {
			display: flex;
			overflow: hidden;
			background: #fff;
			border-bottom: 1px solid rgba(0, 0, 0, 0.2);
			padding: 0 8px;
			margin-left: -16px;
			margin-bottom: 1em;
			height: auto;
			align-items: center;
			justify-content: space-between;
		}
		& > :not(:first-child) + &__row {
			margin-top: 1.5em;
		}
	}

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
	.holdings-summary {
		display: flex;
		margin: 1em;
		margin-left: auto;
		// border-radius: 5px;
		// box-shadow: 3px 3px 10px 2px rgba(0, 0, 0, 0.1);
		// background-color: rgba(255, 255, 0, 0.1);
		// padding: 0.5em;
		flex-wrap: wrap;
		width: 60ch;
		max-width: 40%;
		& > * {
			flex-grow: 1;
			flex-basis: calc(calc(42ch - 100%) * 999);
			text-align: right;
			font-variant-numeric: tabular-nums;
			white-space: nowrap;
		}
	}
	.round {
		border-radius: 50%;
	}
</style>

<ul class="data">
	{#if accountList.holdings && accountList.holdings.length !== 0}
		{#each accountList.holdings as holding}
			<li class="data__row">
				<span>{holding.name || 'account name'}</span>
				<i class="fas fa-camera" />
				<div class="control">
					<button class="item-control" aria-label="view">
						<Fa icon={faBinoculars} color="gray" />
					</button>
					<button
						class="item-control"
						aria-label="edit"
						on:click={handleEditAccount}>
						<Fa icon={faEdit} color="gray" />
					</button>
					<button
						class="item-control"
						aria-label="delete"
						on:click={handleDeleteAccount(holding._id)}>
						<Fa icon={faMinusCircle} color="red" />
					</button>
				</div>
			</li>
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
			{#if holding.name in holdingSummary}
				<div class="holdings-summary">
					<span>
						Value: {holdingSummary[holding.name].value.toFixed(2)}
					</span>
					<span>
						Cost: {holdingSummary[holding.name].cost.toFixed(2)}
					</span>
					<span>
						Gain: {holdingSummary[holding.name].gain.toFixed(2)}
					</span>
				</div>
			{/if}
			<button
				class="item-control"
				aria-label="add position"
				on:click={handlePositionAdd(holding)}>
				<Fa icon={faPlusCircle} color="blue" />
			</button>
		{/each}
	{/if}
	<div class="control">
		<button
			class="round"
			aria-label="add account"
			on:click={handleEditAccount}>
			<Fa icon={faPlus} size="2x" color="green" />
		</button>
	</div>
	<svelte:component this={modal.component} {...modal.data} />
</ul>
