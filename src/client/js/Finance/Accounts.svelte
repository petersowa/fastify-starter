<script>
	import Modal from '../modal.svelte';
	import { get } from 'svelte/store';
	let accounts = [{ name: 'main account' }];
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
			border-bottom: 1px solid rgba(0, 0, 0, 0.2);
			padding: 0 8px;
			height: auto;
			align-items: center;
			justify-content: space-between;
		}
	}
	.control {
		display: flex;
		margin-top: 0;
		& > :not(:last-child) {
			margin-right: 8px;
		}
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
