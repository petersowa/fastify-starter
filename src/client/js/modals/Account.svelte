<script>
	export let toggleModal;
	export let handleData;
	import Modal from '../modal.svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	let formData = {};

	function handleSubmit(e) {
		handleData(e, {
			formData,
			toggleModal,
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
		<label>Account Name</label>
		<input
			tabindex="0"
			class="form-input"
			type="text"
			placeholder="Account Name"
			bind:value={formData.symbol} />
		<button type="submit">Submit</button>
	</form>
</Modal>
