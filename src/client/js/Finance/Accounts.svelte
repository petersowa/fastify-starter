<script>
	import Modal from '../modal.svelte';
	import { get } from 'svelte/store';
	import { accountStore, setSpinner } from './stores';
	import BuyModal from '../modals/Buy.svelte';
	import AccountModal from '../modals/Account.svelte';
	import Position from './Position.svelte';
	import { getQuote } from './handle-ajax';
	import Fa from 'svelte-fa';
	import {
		faEdit,
		faBinoculars,
		faMinusCircle,
		faPlusCircle,
		faPlus,
	} from '@fortawesome/free-solid-svg-icons';

	let showAccount = null;
	let showAddAccount = false;
	let accountList = [];
	let stockQuotes = {};
	let modal = { component: null, data: null };

	function toggleAccountModal(account = null) {
		showAccount = account ? account.name : null;
	}

	const toggleModalAddAccount = () => {
		console.log({ showAddAccount });
		showAddAccount = !showAddAccount;
	};

	const unsubscribe = accountStore.subscribe(async list => {
		const quotes = {};
		if (list.length === 0) return;
		const clearSpinner = setSpinner();
		try {
			accountList = list;
			console.log({ list });
			if (!accountList.holdings) throw new Error('no holdings');
			accountList.holdings.forEach(holding => {
				holding.positions.forEach(position => {
					if (position.symbol in quotes) return;
					quotes[position.symbol] = getQuote(position.symbol);
				});
			});

			const res = await Promise.all(Object.values(quotes));
			res.forEach(quote => (stockQuotes[quote.symbol] = quote));
			console.log({ accountList });
			clearSpinner();
		} catch (err) {
			clearSpinner();
			console.error(err);
		}
	});

	function handleBuyForm(e, { formData, account, toggleModal }) {
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
		accountStore.addPosition(newPosition, account ? account.name : 'alpha');
	}

	function handlePositionDelete(position, holding) {
		return e => {
			accountStore.deletePosition(position._id, holding._id);
		};
	}

	function handlePositionUpdate(position, holding) {
		return e => {
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

	function handleEditAccount() {
		modal.component = AccountModal;
		modal.data = {
			toggleModal: () => (modal.component = null),
			handleData: (e, { formData: { accountName } }) => {
				console.log(accountName);
				modal.component = null;
			},
		};
	}
</script>

<style type="scss">
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
					<button class="item-control" aria-label="delete">
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
							{stockQuotes}
							onDelete={handlePositionDelete(position, holding)}
							onUpdate={handlePositionUpdate(position, holding)} />
					{/if}
				</li>
			{/each}
			<button
				class="item-control"
				aria-label="add position"
				on:click={() => toggleAccountModal(holding)}>
				<Fa icon={faPlusCircle} color="blue" />
			</button>
			{#if showAccount === holding.name}
				<BuyModal
					toggleModal={toggleAccountModal}
					handleData={handleBuyForm}
					{holding} />
			{/if}
		{/each}
	{/if}
	<div class="control">
		<button
			class="round"
			aria-label="add account"
			on:click={toggleModalAddAccount}>
			<Fa icon={faPlus} size="2x" color="green" />
		</button>
		{#if showAddAccount}
			<BuyModal
				toggleModal={toggleModalAddAccount}
				handleData={handleBuyForm} />
		{/if}
	</div>
	<svelte:component this={modal.component} {...modal.data} />
</ul>
