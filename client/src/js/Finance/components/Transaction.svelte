<script lang="typescript">
	export let setTransactionType;
</script>

<style>
</style>

<h2 class="title">Select Transaction</h2>
<div>
	<button on:click={() => setTransactionType('buy')}>Buy</button>
	<button>Sell</button>
	<button>Split</button>
	<button>Dividend</button>
	<button>Deposit</button>
	<button>Withdraw</button>
</div>
