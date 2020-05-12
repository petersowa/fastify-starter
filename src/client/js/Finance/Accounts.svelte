<script>
	import Modal from '../modal.svelte';
	import { get } from 'svelte/store';
	let accounts = [
		{ name: 'main account' },
		{ name: 'joint account' },
		{ name: 'private account' },
	];
	let positions = [
		{
			symbol: 'ibm',
			date: '12/01/1990',
			quantity: 100,
			cost: 500.12,
			gain: 3.42,
			dollarGain: 2432.21,
		},
		{
			symbol: 'csco',
			date: '12/01/1990',
			quantity: 1400,
			cost: 5200.12,
			gain: 123.42,
			dollarGain: 24332.21,
		},
	];
	let showAccountModal = false;

	function toggleAccountModal() {
		showAccountModal = !showAccountModal;
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
	{#each accounts as account}
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
		{#each positions as position}
			<li class="position">
				<span>{position.symbol.toUpperCase()}</span>
				<span>{position.date}</span>
				<span class="right-justify">{position.quantity}</span>
				<span class="right-justify">{position.cost}</span>
				<span class="right-justify">{position.gain * 100}</span>
				<span class="right-justify">{position.dollarGain}</span>
			</li>
		{/each}
	{/each}
	<div class="control">
		<button>New Account</button>
	</div>
</ul>

{#if showAccountModal}
	<Modal on:close={toggleAccountModal}>
		<h2 slot="header">Account Info</h2>
		<form>
			<label>Account</label>
			<input type="text" />
		</form>
	</Modal>
{/if}
