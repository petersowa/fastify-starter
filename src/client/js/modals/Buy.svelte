<script>
	export let toggleAccountModal;
	export let handleBuyForm;
	export let account;
	import Modal from '../modal.svelte';
	import { createEventDispatcher, onDestroy } from 'svelte';

	let formData = {};

	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');

	let modal;

	const handle_keydown = e => {
		if (e.key === 'Escape') {
			close();
			return;
		}

		if (e.key === 'Tab') {
			// trap focus
			const nodes = modal.querySelectorAll('*');
			const tabbable = Array.from(nodes).filter(n => n.tabIndex >= 0);

			let index = tabbable.indexOf(document.activeElement);
			if (index === -1 && e.shiftKey) index = 0;

			index += tabbable.length + (e.shiftKey ? -1 : 1);
			index %= tabbable.length;

			tabbable[index].focus();
			e.preventDefault();
		}
	};

	const previously_focused =
		typeof document !== 'undefined' && document.activeElement;

	if (previously_focused) {
		onDestroy(() => {
			previously_focused.focus();
		});
	}

	function handleSubmit(e) {
		console.log({ formData });
		// validate
		// if valid date then send to handle buy form
		handleBuyForm(e, { formData, account });
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

<Modal on:close={toggleAccountModal}>
	<h2 class="buy-title" slot="header">Account Info</h2>
	<form class="buy-form" on:submit={handleSubmit}>
		<label>Symbol</label>
		<input
			class="form-input"
			type="text"
			placeholder="Symbol"
			bind:value={formData.symbol} />
		<label>Date</label>
		<input
			class="form-input"
			type="date"
			placeholder="Date"
			bind:value={formData.date} />
		<label>Shares</label>
		<input
			class="form-input"
			type="text"
			placeholder="Shares"
			bind:value={formData.shares} />
		<label>Price</label>
		<input
			class="form-input"
			type="text"
			placeholder="Price"
			bind:value={formData.price} />
		<label>Fees</label>
		<input
			class="form-input"
			type="text"
			placeholder="Fees"
			bind:value={formData.fee} />
		<button type="submit">Submit</button>
	</form>
</Modal>
