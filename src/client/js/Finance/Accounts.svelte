<script>
	import Modal from '../modal.svelte';
	import { get } from 'svelte/store';
	import { accountStore, setSpinner } from './stores';
	import BuyModal from '../modals/Buy.svelte';
	import { getQuote } from './handle-ajax';

	let showAccountModal = false;
	let accountList = [];
	let stockQuotes = {};

	function toggleAccountModal() {
		showAccountModal = !showAccountModal;
	}

	const unsubscribe = accountStore.subscribe(async list => {
		const quotes = {};
		const clearSpinner = setSpinner();

		accountList = list;
		accountList.forEach(account => {
			account.positions.forEach(position => {
				if (position.symbol in quotes) return;
				quotes[position.symbol] = getQuote(position.symbol);
			});
		});

		const res = await Promise.all(Object.values(quotes));
		res.forEach(quote => (stockQuotes[quote.symbol] = quote));
		clearSpinner();
	});
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
		& > :not(:last-child) {
			margin-right: 8px;
		}
	}
	.position {
		display: grid;
		grid-template-columns: 0.5fr 1fr 0.5fr 0.5fr 0.5fr 1fr;
	}
	.right-justify {
		justify-self: right;
	}
</style>

<ul class="data">
	{#each accountList as account}
		<li class="data__row">
			<span>{account.name}</span>
			<div class="control">
				<button on:click={toggleAccountModal}>View</button>
				<button>Edit</button>
				<button>Delete</button>
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
			<span class="right-justify">Gain %</span>
			<span class="right-justify">$ Gain</span>
		</li>
		{#each account.positions as position}
			<li class="position">
				{#if position}
					<!-- {JSON.stringify(position)} -->
					<!-- {JSON.stringify(stockQuotes, null, 2)} -->
					<span>{position.symbol.toUpperCase()}</span>
					<span>{position.date}</span>
					<span class="right-justify">{position.quantity}</span>
					<span class="right-justify">
						{position.symbol in stockQuotes ? (position.quantity * stockQuotes[position.symbol].latestPrice).toFixed(2) : 'loading...'}
					</span>
					<span class="right-justify">{position.gain * 100}</span>
					<span class="right-justify">{position.dollarGain}</span>
				{/if}
			</li>
		{/each}
	{/each}
	<div class="control">
		<button>New Account</button>
	</div>
</ul>

{#if showAccountModal}
	<BuyModal {toggleAccountModal} />
{/if}
