<script>
	export let toggleModal;
	export let handleData;
	import Modal from '../modal.svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	let formData = { accountName: '' };

	function handleSubmit(e) {
		handleData(e, {
			formData,
			toggleModal,
		});
	}
</script>

<style>
	.title {
		font-size: 1.2rem;
	}
	.form {
		display: grid;
		padding: 0.5em;
		grid-template-columns: 5rem 1fr;
		grid-template-rows: auto;
		grid-row-gap: 0.2em;
	}
	.input {
		background: #ccc;
	}
</style>

<Modal on:close={toggleModal}>
	<h2 class="title" slot="header">Account Info</h2>
	<form class="form" on:submit|preventDefault={handleSubmit}>
		<label>Account Name</label>
		<input
			tabindex="0"
			class="input"
			type="text"
			placeholder="Account Name"
			bind:value={formData.accountName} />
		<button type="submit">Submit</button>
	</form>
</Modal>
