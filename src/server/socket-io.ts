import io from 'socket.io';
import { Server } from 'http';

function init(server: Server): io.Server {
	return io(server);
}

export default { init };
