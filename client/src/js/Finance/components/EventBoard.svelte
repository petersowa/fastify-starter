<script>
	import io from 'socket.io-client';
	// setup sockets
	const socket = io();

	socket.on('connect', () => {
		console.log('connected ');
		socket.emit('query', 'query data');
	});

	socket.on('update', (msg) => {
		console.log(msg);
	});
</script>

<style>
</style>
