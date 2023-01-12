import '@fastify/view'; // import for type support

const article = `
An important change is that the Tab key is no longer the default way to expand Emmet abbreviations. Instead, Emmet abbreviations will now appear in the suggestion list. They can be selected like any other smart completion and on selection, the abbreviation will be expanded.

We can quickly view the Emmet abbreviation by clicking the info icon next to list shown. By typing text next to hash (#) will be taken as id and text next to period(.) will be considered as class name. Emmet basically works related to CSS selectors.	
`;

const images = [
	// { src: 'https://picsum.photos/300' },
	// { src: 'https://picsum.photos/350' },
	// { src: 'https://picsum.photos/370' },
];

async function routes(fastify, options) {
	fastify.get('/', async (request, reply) => {
		const replyData = {
			name: 'home page',
			article,
			username: request.session.username,
			csrfToken: await reply.generateCsrf(),
			appState: request.session.appState,
			info: request.session.appState.info.getInfo(), // {{debugJSON info}}
			whichModal: request.session.appState.modal,
		};

		console.log(
			'>>>> HOME',
			request.session,
			request.session.appState.modal,
			{ replyData }
		);
		return reply.view('./pages/index', replyData);
	});

	fastify.get('/about', (request, reply) => {
		reply.view('./pages/about', {
			name: 'about page',
			article,
			images,
			username: request.session.username,
			whichModal: request.session.appState.modal,
		});
	});

	fastify.get('/blog', (request, reply) => {
		reply.view('./pages/blog', {
			name: 'blog page',
			article,
			username: request.session.username,
			whichModal: request.session.appState.modal,
		});
	});

	fastify.get('/register', async (request, reply) => {
		const errors = request.session.flash.get('auth');
		const csrfToken = await reply.generateCsrf();
		// console.log({ csrfToken, session: request.session });
		return reply.view('./pages/register', {
			name: 'Create Account',
			article,
			username: request.session.username,
			csrfToken,
			whichModal: 'registerForm',
			errors,
		});
	});

	fastify.get('/login', async (request, reply) => {
		const errors = request.session.flash.get('auth');
		const csrfToken = await reply.generateCsrf();
		// console.log({ csrfToken, session: request.session });

		console.error({ errors });
		return reply.view('./pages/login', {
			name: 'Login',
			article,
			username: request.session.username,
			csrfToken,
			whichModal: 'loginForm',
			errors,
		});
	});

	fastify.get(
		'/test-auth',
		{
			async preHandler(request, reply) {
				if (!request.session.username) reply.redirect('/login');
				else reply.status(200).send('authorized');
				return reply;
			},
		},
		(request, reply) => {
			reply.send('test auth reply');
		}
	);
}
//
export default routes;
