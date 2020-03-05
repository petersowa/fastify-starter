import fastify from 'fastify';
import path from 'path';

import { Server, IncomingMessage, ServerResponse } from 'http';
import authRoutes from '../routes/auth';

let count = 0;

const PORT: number = parseInt(process.env.PORT || '3000', 10);

const server: fastify.FastifyInstance<
	Server,
	IncomingMessage,
	ServerResponse
> = fastify({ logger: true, http2: false });

server.register(authRoutes, { prefix: '/auth' });
server.register(require('fastify-static'), {
	root: path.join(__dirname, '..', 'public'),
	prefix: '/',
});

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

server.get('/ping', opts, async (request, reply) => {
	return { pong: 'it worked!', count };
});

server.post('/counter', postCounter, async (request, reply) => {
	request.log.info('request to increment count');
	console.log(request.body);
	++count;
	return { count };
});

server.listen(PORT, '0.0.0.0', err => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}
});
