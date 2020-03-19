import fastify from 'fastify';
import path from 'path';

import { Server, IncomingMessage, ServerResponse } from 'http';
import authRoutes from '../routes/auth';
import templateRoutes from '../routes/template';

import socketIo from './socket-io';

let count = 0;

const PORT: number = parseInt(process.env.PORT || '3000', 10);

const app: fastify.FastifyInstance<
	Server,
	IncomingMessage,
	ServerResponse
> = fastify({ logger: true, http2: false });

// add auth routes
app.register(authRoutes, { prefix: '/auth' });
const io = socketIo.init(app.server);

io.on('connection', function(socket) {
	console.log('a user connected', JSON.stringify(socket.id, null, 2));
	socket.on('query', (query: any) => {
		console.log(query, socket.id);
	});
});

setInterval(() => {
	io.emit('update', 'server message: hi');
}, 1000);

// add static routes
app.register(require('fastify-static'), {
	root: path.join(__dirname, '..', '..', 'public'),
	prefix: '/',
});

// add template support
app.register(require('point-of-view'), {
	engine: {
		ejs: require('ejs'),
	},
});

app.register(templateRoutes);

const opts: fastify.RouteShorthandOptions = {
	schema: {
		response: {
			200: {
				type: 'object',
				properties: {
					pong: {
						type: 'string',
					},
					count: {
						type: 'number',
					},
				},
			},
		},
	},
};

const postCounter: fastify.RouteShorthandOptions = {
	schema: {
		body: {
			type: 'object',
			required: ['test'],
			properties: {
				test: {
					type: 'number',
				},
			},
		},
		response: {
			200: {
				type: 'object',
				properties: {
					count: {
						type: 'number',
					},
				},
			},
		},
	},
};

app.get('/ping', opts, async (request, reply) => {
	return { pong: 'it worked!', count };
});

app.post('/counter', postCounter, async (request, reply) => {
	request.log.info('request to increment count');
	console.log(request.body);
	++count;
	return { count };
});

app.listen(PORT, '0.0.0.0', err => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
});
