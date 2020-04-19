import socket from 'socket.io';
import { Server } from 'http';

function init(server: Server): socket.Server {
	const io: socket.Server = socket(server);
	eventsInit(io);
	return io;
}

function eventsInit(io: socket.Server): void {
	io.on('connection', function (socket) {
		console.log('a user connected', JSON.stringify(socket.id, null, 2));
		socket.on('query', (query: any) => {
			console.log(query, socket.id);
			socket.emit('update', 'click');
		});
	});

	setInterval(() => {
		io.emit('update', 'server message: ' + Date.now());
	}, 10000);
}

export default { init };
