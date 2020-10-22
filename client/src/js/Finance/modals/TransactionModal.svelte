<script>
	import Modal from '../../components/modal.svelte';
	import BuyForm from '../components/BuyForm.svelte';

	import TransactionSelect from '../components/Transaction.svelte';

	export let toggleModal;
	export let handleData;
	export let holding;
	export let position;

	let transactionType = 'pending';

	const setTransactionType = (type) => (transactionType = type);
</script>

<style>
	.buy-title {
		font-size: 1.2rem;
	}
</style>

<Modal on:close={toggleModal}>
	<h2 class="buy-title" slot="header">Account Info</h2>
	<TransactionSelect {setTransactionType} />
	{#if transactionType === 'buy'}
		<BuyForm {holding} {position} {handleData} {toggleModal} />
	{/if}
</Modal>
