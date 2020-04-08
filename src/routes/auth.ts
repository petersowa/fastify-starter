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

	fastify.post('/login', async (request, reply) => {
		const { password, username } = request.body;
		request.session.isAuth = false;
		request.session.username = '';
		if (username === 'jack' && password === 'black') {
			request.session.isAuth = true;
			request.session.username = username;
		}
		return reply.redirect('/');
	});

	fastify.get('/logout', async (request, reply) => {
		if (!request.session.isAuth) return reply.redirect('/');
		request.destroySession((err) => {
			if (err) {
				reply.status(500);
				return reply.send('Internal Server Error: ES1');
			} else {
				console.log('session destroyed');
				return reply.redirect('/');
			}
		});
	});
}

export default routes;
