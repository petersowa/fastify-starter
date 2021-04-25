import io, { Server as socket } from 'socket.io';
import { Server } from 'http';

function init(server: Server): io.Server {
	const io: io.Server = new socket(server, {});
	eventsInit(io);
	return io;
}

function eventsInit(io: io.Server): void {
	io.on('connection', function (socket) {
		console.log('a user connected', JSON.stringify(socket.id, null, 2));
		socket.on('query', (query: any) => {
			console.log(query, socket.id);
			socket.emit('update', 'click');
		});
	});

	// setInterval(() => {
	// 	io.emit('update', 'server message: ' + Date.now());
	// }, 10000);
}

export default { init };
