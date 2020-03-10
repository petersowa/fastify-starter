import fastify from 'fastify';
import pov from 'point-of-view';

async function routes(fastify: fastify.FastifyInstance, options: {}) {
	fastify.get('/home', (request, reply) => {
		reply.view('/templates/home.ejs', { name: 'home page' });
	});
}

export default routes;
