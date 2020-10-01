<script lang="typescript">
	export let toggleModal: () => void;
	export let handleData: (e: Event, {}) => void;
	export let holding;
	export let position;
	import Modal from '../../components/modal.svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	let formData = { ...position };

	onMount(() => {
		if (!position) position = {};
		console.log({ holding });
		formData = {
			symbol: position.symbol || '',
			date: new Date(position.date || new Date().toISOString())
				.toISOString()
				.substring(0, 10),
			shares: position.quantity || '',
			price: position.purchasePrice || '',
			fee: position.fees,
		};
	});

	function handleSubmit(e: Event) {
		console.log({ formData });
		// validate
		// if valid date then send to handle buy form
		formData.symbol = formData.symbol.toUpperCase();
		handleData(e, {
			formData,
			toggleModal,
			position,
			holding,
		});
	}
</script>

<style>
</style>

<Modal on:close={toggleModal}>
	<h2 class="buy-title" slot="header">Select Transaction</h2>
	<form class="buy-form" on:submit|preventDefault={handleSubmit}>
		<button>Buy</button>
		<button>Sell</button>
		<button>Split</button>
		<button>Dividend</button>
		<button>Deposit</button>
		<button>Withdraw</button>
	</form>
</Modal>
