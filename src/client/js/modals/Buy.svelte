<script>
	export let toggleAccountModal;
	import Modal from '../modal.svelte';
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

<Modal on:close={toggleAccountModal}>
	<h2 class="buy-title" slot="header">Account Info</h2>
	<form class="buy-form">
		<label>Symbol</label>
		<input class="form-input" type="text" placeholder="Symbol" />
		<label>Date</label>
		<input class="form-input" type="date" placeholder="Date" />
		<label>Shares</label>
		<input class="form-input" type="number" placeholder="Shares" />
	</form>
</Modal>
