import fastify from 'fastify';
import pov from 'point-of-view'; // import for type support

async function routes(fastify: fastify.FastifyInstance, options: {}) {
	fastify.get('/', (request, reply) => {
		reply.view('./views/layout', {
			name: 'home page',
		});
	});
}

export default routes;
