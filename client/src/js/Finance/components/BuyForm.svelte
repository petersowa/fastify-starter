<script>
	export let toggleModal;
	export let handleData;
	export let holding;
	export let position;
	import { onMount } from 'svelte';
	import { quotesStore } from '../stores/QuotesStore';

	let formData = {
		symbol: '',
		date: new Date().toISOString(),
		shares: '0.00',
		price: '0.00',
		fee: '0.00',
		...position,
	};

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
			fee: position.fees || '',
		};
	});

	function validateForm(formData) {
		const fields = [
			{ name: 'date', type: 'date', required: true },
			{ name: 'fee', type: 'number', required: true },
			{ name: 'price', type: 'number', required: true },
			{ name: 'shares', type: 'number', required: true },
			{ name: 'symbol', type: 'number', required: true },
		];
		return true;
	}

	function handleSubmit(e) {
		console.log({ formData });
		if (validateForm(formData)) {
			formData.symbol = formData.symbol.toUpperCase();
			quotesStore
				.getQuote(formData.symbol)
				.then((quote) => {
					console.log('handle submit', { quote });
					position.type = 'equity';
					handleData(e, {
						formData,
						toggleModal,
						position,
						holding,
					});
				})
				.catch((handleSubmitError) =>
					console.log({ handleSubmitError })
				);
		}
		// validate
		// if valid date then send to handle buy form
	}
</script>

<style>
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

<form class="buy-form" on:submit|preventDefault={handleSubmit}>
	<label for="symbol-input">Symbol</label>
	<input
		id="symbol-input"
		tabindex="0"
		class="form-input"
		type="text"
		placeholder="Symbol"
		bind:value={formData.symbol} />
	<label for="date-input">Date</label>
	<input
		id="date-input"
		tabindex="0"
		class="form-input"
		type="date"
		placeholder="Date"
		bind:value={formData.date} />
	<label for="shares-input">Shares</label>
	<input
		id="shares-input"
		tabindex="0"
		class="form-input"
		type="text"
		placeholder="Shares"
		bind:value={formData.shares} />
	<label for="price-input">Price</label>
	<input
		id="price-input"
		tabindex="0"
		class="form-input"
		type="text"
		placeholder="Price"
		bind:value={formData.price} />
	<label for="fees-input">Fees</label>
	<input
		id="fees-input"
		tabindex="0"
		class="form-input"
		type="text"
		placeholder="Fees"
		bind:value={formData.fee} />
	<button type="submit">Submit</button>
</form>
