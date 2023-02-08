import type * as fastify from 'fastify';
import { UserModel } from '../models/userModel';

async function routes(fastify: fastify.FastifyInstance): Promise<void> {
	fastify.addHook('preHandler', (request, reply, done) => {
		console.log('PREHANDLER'); //, request.body, request.method);
		if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
			fastify.csrfProtection(request, reply, done);
		} else {
			done();
		}
		console.log('PREHANDLER DONE');
	});

	fastify.get('/test', async (): Promise<{ data: 'test' }> => {
		return { data: 'test' };
	});

	fastify.post<{
		Body: { username: string; password: string };
	}>('/login', async (request, reply) => {
		const { password, username } = request.body;
		// console.trace('POST LOGIN ROUTE', {
		// 	Body: request.body,
		// 	Session: request.session,
		// });
		try {
			const user = await UserModel.findOne({ email: username });

			if (!user) {
				request.session.flash.add(
					'auth',
					'password or username is not correct'
				);
				return reply.redirect('/login');
			}

			const isValidPW = await user.validatePassword(password);

			if (isValidPW) {
				// console.log({ user, isValidPW, username });
				request.session.isAuth = true;
				request.session.username = username; // email
				request.session.userId = user.id;
				console.log({
					LoginRedirect: request.session.username,
				});
				reply.redirect('/');
			} else {
				request.session.flash.add(
					'auth',
					'password or username is not correct'
				);
				reply.redirect('/login');
			}
		} catch (error) {
			console.error({ LoginError: error });
			if (error instanceof Error) throw new Error(error.message);
		}
		console.log('RETURN POST LOGIN');
		await reply;
	});

	interface Body {
		username: string;
		password: string;
		'password-match': string;
	}
	fastify.post<{ Body: Body }>(
		'/register',
		{
			schema: {
				body: {
					type: 'object',
					properties: {
						username: { type: 'string' },
						password: { type: 'string' },
					},
				},
			},
		},
		(request, reply) => {
			const {
				password,
				username,
				'password-match': passwordMatch,
			} = request.body;
			// console.log(username, password, passwordMatch);
			if (password !== passwordMatch) {
				// request.flash('auth', 'Passwords do not match.');
				request.session.flash.add('auth', 'passwords do not match');
				reply.redirect('/register');
			}
			const newUser = new UserModel({
				name: username,
				password: password,
				email: username,
			});
			newUser
				.save()
				.then((user) => {
					request.session.isAuth = true;
					request.session.username = username; // email
					request.session.userId = user.id;
					reply.redirect('/');
				})
				.catch((err: Error) => {
					request.session.flash.add(
						'auth',
						'duplicate or unable to register'
					);
					reply.redirect('/register');
				});
		}
	);

	fastify.get('/logout', async (request, reply) => {
		console.log('POST LOGOUT ROUTE');
		if (!request.session.isAuth) reply.redirect('/');
		request.session.destroy((err) => {
			if (err) {
				reply.status(500);
				reply.send('Internal Server Error: ES1');
			} else {
				reply.redirect('/');
			}
		});
		await reply;
	});
}

export default routes;
