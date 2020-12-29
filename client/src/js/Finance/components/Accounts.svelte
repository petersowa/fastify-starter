<script>
	import { onDestroy } from 'svelte';
	import { accountStore, setSpinner } from '../stores/stores';
	import { quotesStore } from '../stores/QuotesStore';
	import { setModal, clearModal } from '../stores/Modal';
	import AccountModal from '../modals/Account.svelte';
	import Positions from './Positions.svelte';
	import HoldingsSummary from './HoldingsSummary.svelte';
	import Icon from 'svelte-awesome';
	import {
		faEdit,
		faBinoculars,
		faMinusCircle,
		faPlus,
	} from '@fortawesome/free-solid-svg-icons';

	let accountList = [];
	let stockQuotes = {};
	let holdingSummary = {};

	const unsubscribe = accountStore.subscribe(async (list) => {
		if (!list || list.length === 0) return;
		const clearSpinner = setSpinner();
		try {
			accountList = list;
			if (!accountList.holdings) throw new Error('no holdings');

			quotesStore.subscribe((quoteData) => {
				stockQuotes = quoteData.quote;
				if (!stockQuotes) return;
				accountList.holdings.forEach((holding) => {
					let cost = 0;
					let value = 0;
					holding.positions.forEach((position) => {
						if (position.symbol in stockQuotes) {
							cost += position.cost;
							value +=
								position.quantity *
								stockQuotes[position.symbol].latestPrice;
							holdingSummary[holding.name] = {
								cost,
								value,
								gain: value - cost,
							};
						}
					});
				});
			});

			clearSpinner();
		} catch (err) {
			console.error(err);
			clearSpinner();
		}
	});

	onDestroy(() => {
		unsubscribe();
	});

	function handleEditAccount() {
		setModal({
			component: AccountModal,
			data: {
				toggleModal: () => clearModal(),
				handleData: (e, { formData: { accountName } }) => {
					if (
						typeof accountName == 'string' &&
						accountName.length > 0
					) {
						accountStore.addHoldingsAccount(accountName);
					}
					clearModal();
				},
			},
		});
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
		min-width: 20rem;
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
						<Icon data={faBinoculars} style="color: gray;" />
					</button>
					<button
						class="item-control"
						aria-label="edit"
						on:click={handleEditAccount}>
						<Icon data={faEdit} style="color: gray;" />
					</button>
					<button
						class="item-control"
						aria-label="delete"
						on:click={handleDeleteAccount(holding._id)}>
						<Icon data={faMinusCircle} style="color: red;" />
					</button>
				</div>
			</li>

			<Positions {holding} />

			<HoldingsSummary
				holdingSummary={holding.name in holdingSummary && holdingSummary[holding.name]} />
		{/each}
	{/if}
	<div class="control">
		<button
			class="round"
			aria-label="add account"
			on:click={handleEditAccount}>
			<Icon
				data={faPlus}
				scale="1"
				style="color: green; width: 2em; height: 2em;" />
		</button>
	</div>
</ul>
