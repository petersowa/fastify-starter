import fastify from 'fastify';

async function routes(fastify: fastify.FastifyInstance, options: {}) {
	fastify.get('/', (request, reply) => {
		reply.view('/views/pages/index.ejs', { name: 'home page' });
	});
}

export default routes;
