import fastify from 'fastify';
import pov from 'point-of-view'; // import for type support

const article = `
An important change is that the Tab key is no longer the default way to expand Emmet abbreviations. Instead, Emmet abbreviations will now appear in the suggestion list. They can be selected like any other smart completion and on selection, the abbreviation will be expanded.

We can quickly view the Emmet abbreviation by clicking the info icon next to list shown. By typing text next to hash (#) will be taken as id and text next to period(.) will be considered as class name. Emmet basically works related to CSS selectors.	
`;

async function routes(fastify: fastify.FastifyInstance, options: {}) {
	fastify.get('/', (request, reply) => {
		reply.view('./views/layout', {
			name: 'home page',
			article,
		});
	});
}

export default routes;
