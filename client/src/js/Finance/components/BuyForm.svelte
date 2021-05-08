<script lang="ts">
	export let toggleModal;
	export let handleData;
	export let holding;
	export let position;
	import { onMount } from 'svelte';
	import { getQuote } from '../stores/QuotesStore';
	import __qq from '../../utils/qq';

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
		__qq.log({ holding });
		formData = {
			symbol: position.symbol || '',
			date: new Date(position.purchaseDate || new Date().toISOString())
				.toISOString()
				.substring(0, 10),
			shares: position.quantity || '',
			price: position.purchasePrice || '',
			fee: position.fees || '0',
		};
	});

	const isType = {
		string: (val: string) => typeof val == 'string' && val != '',
		number: (val: string) => {
			const res =
				typeof val == 'number' ||
				(typeof val == 'string' && val != '' && !isNaN(+val));
			__qq.log(val, typeof val, res);
			return res;
		},
		date: (val: string) => Date.parse(val) != NaN,
	};

	function validateForm(
		formData,
		formFields = [
			{ name: 'date', type: 'date', required: true },
			{ name: 'fee', type: 'number', required: true },
			{ name: 'price', type: 'number', required: true },
			{ name: 'shares', type: 'number', required: true },
			{ name: 'symbol', type: 'string', required: true },
		]
	) {
		const error = [];

		for (const formField of formFields) {
			__qq.log(
				'checking field:',
				formField.name,
				formData[formField.name],
				formField.type
			);
			if (!isType[formField.type](formData[formField.name])) {
				error.push(
					`field type mismatch ${
						formData[formField.name]
					} ${typeof formData[formField.name]}`
				);
				__qq.log({ error });
				return false;
			}
		}
		return true;
	}

	function handleSubmit(e) {
		__qq.log({ formData });
		if (validateForm(formData)) {
			formData.symbol = formData.symbol.toUpperCase();
			getQuote(formData.symbol)
				.then((quote) => {
					__qq.log('handle submit', { quote });
					position.type = 'equity';
					handleData(e, {
						formData,
						toggleModal,
						position,
						holding,
					});
				})
				.catch((handleSubmitError) => __qq.log({ handleSubmitError }));
		}
		// validate
		// if valid date then send to handle buy form
	}

	function checkForQuote(e) {
		__qq.log('change');
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
		on:change={checkForQuote}
		bind:value={formData.symbol}
	/>
	<label for="date-input">Date</label>
	<input
		id="date-input"
		tabindex="0"
		class="form-input"
		type="date"
		placeholder="Date"
		bind:value={formData.date}
	/>
	<label for="shares-input">Shares</label>
	<input
		id="shares-input"
		tabindex="0"
		class="form-input"
		type="text"
		placeholder="Shares"
		bind:value={formData.shares}
	/>
	<label for="price-input">Price</label>
	<input
		id="price-input"
		tabindex="0"
		class="form-input"
		type="text"
		placeholder="Price"
		bind:value={formData.price}
	/>
	<label for="fees-input">Fees</label>
	<input
		id="fees-input"
		tabindex="0"
		class="form-input"
		type="text"
		placeholder="Fees"
		bind:value={formData.fee}
	/>
	<button type="submit">Submit</button>
</form>
