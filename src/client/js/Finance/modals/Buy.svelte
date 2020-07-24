<script>
	export let toggleModal;
	export let handleData;
	export let holding;
	export let position;
	import Modal from '../../components/modal.svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	let formData = { ...position };

	onMount(() => {
		if (!position) position = {};
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

	function handleSubmit(e) {
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
	.buy-title {
		font-size: 1.2rem;
	}
	.buy-form {
		display: grid;
		padding: 0.5em;
		grid-template-columns: 5rem 1fr;
		grid-template-rows: auto;
		grid-row-gap: 0.2em;
	}
	.form-input {
		background: #ccc;
	}
</style>

<Modal on:close={toggleModal}>
	<h2 class="buy-title" slot="header">Account Info</h2>
	<form class="buy-form" on:submit|preventDefault={handleSubmit}>
		<label>Symbol</label>
		<input
			tabindex="0"
			class="form-input"
			type="text"
			placeholder="Symbol"
			bind:value={formData.symbol} />
		<label>Date</label>
		<input
			tabindex="0"
			class="form-input"
			type="date"
			placeholder="Date"
			bind:value={formData.date} />
		<label>Shares</label>
		<input
			tabindex="0"
			class="form-input"
			type="text"
			placeholder="Shares"
			bind:value={formData.shares} />
		<label>Price</label>
		<input
			tabindex="0"
			class="form-input"
			type="text"
			placeholder="Price"
			bind:value={formData.price} />
		<label>Fees</label>
		<input
			tabindex="0"
			class="form-input"
			type="text"
			placeholder="Fees"
			bind:value={formData.fee} />
		<button type="submit">Submit</button>
	</form>
</Modal>
