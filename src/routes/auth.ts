import * as fastify from 'fastify';

import { Server, IncomingMessage, ServerResponse } from 'http';

async function routes(
	fastify: fastify.FastifyInstance,
	_options: {},
	done: (err?: fastify.FastifyError | undefined) => void
): Promise<void> {
	fastify.get<Server, IncomingMessage, ServerResponse>(
		'/test',
		async (): Promise<{ data: 'test' }> => {
			return { data: 'test' };
		}
	);
	// done();
}

export default routes;
