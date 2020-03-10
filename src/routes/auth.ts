import * as fastify from 'fastify';

import { Server, IncomingMessage, ServerResponse } from 'http';

async function routes(fastify: fastify.FastifyInstance, options: {}) {
	fastify.get<Server, IncomingMessage, ServerResponse>(
		'/test',
		async (request, reply) => {
			return { data: 'test' };
		}
	);
}

export default routes;
