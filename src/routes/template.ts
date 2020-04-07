import fastify from 'fastify';
import 'point-of-view'; // import for type support

const article = `
An important change is that the Tab key is no longer the default way to expand Emmet abbreviations. Instead, Emmet abbreviations will now appear in the suggestion list. They can be selected like any other smart completion and on selection, the abbreviation will be expanded.

We can quickly view the Emmet abbreviation by clicking the info icon next to list shown. By typing text next to hash (#) will be taken as id and text next to period(.) will be considered as class name. Emmet basically works related to CSS selectors.	
`;

const images = [
	{ src: 'https://picsum.photos/300' },
	{ src: 'https://picsum.photos/350' },
	{ src: 'https://picsum.photos/370' },
];

async function routes(
	fastify: fastify.FastifyInstance,
	options: {}
): Promise<void> {
	fastify.get('/', (request, reply) => {
		const { csrfToken } = request.session;
		console.log('>>>> HOME', request.body);
		reply.view('./pages/index', {
			name: 'home page',
			article,
			username: request.session.username,
			csrfToken,
		});
	});

	fastify.get('/about', (request, reply) => {
		const { csrfToken } = request.session;
		reply.view('./pages/about', {
			name: 'about page',
			article,
			images,
			username: request.session.username,
			csrfToken,
		});
	});

	fastify.get('/blog', (request, reply) => {
		const { csrfToken } = request.session;
		reply.view('./pages/blog', {
			name: 'blog page',
			article,
			username: request.session.username,
			csrfToken,
		});
	});
}
//
export default routes;
