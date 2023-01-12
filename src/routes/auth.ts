import * as fastify from 'fastify';
import { UserModel } from '../models/userModel';

async function routes(fastify: fastify.FastifyInstance): Promise<void> {
	fastify.addHook('preHandler', (request, reply, done) => {
		if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
			fastify.csrfProtection(request, reply, done);
		}
		done();
	});

	fastify.get('/test', async (): Promise<{ data: 'test' }> => {
		return { data: 'test' };
	});

	fastify.post<{ Body: { username: string; password: string } }>(
		'/login',
		async (request, reply) => {
			const { password, username } = request.body;
			UserModel.findOne({ email: username })
				.then(async (user) => {
					if (user) {
						const isValidPW = await user.validatePassword(password);
						if (isValidPW) {
							// console.log({ user, isValidPW, username });
							request.session.isAuth = true;
							request.session.username = username; // email
							request.session.userId = user.id;
							return reply.redirect('/');
						} else {
							request.session.flash.add(
								'auth',
								'password or username is not correct'
							);
							return reply.redirect('/login');
						}
					} else {
						request.session.flash.add(
							'auth',
							'password or username is not correct'
						);

						return reply.redirect('/login');
					}
				})
				.catch((err) => {
					request.session.flash.add('auth', err.message);
					return reply.redirect('/login');
				});
			return;
		}
	);

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
		async (request, reply) => {
			const {
				password,
				username,
				'password-match': passwordMatch,
			} = request.body;
			// console.log(username, password, passwordMatch);
			if (password !== passwordMatch) {
				// request.flash('auth', 'Passwords do not match.');
				request.session.flash.add('auth', 'passwords do not match');
				return reply.redirect('/register');
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
					return reply.redirect('/');
				})
				.catch((err: Error) => {
					request.session.flash.add(
						'auth',
						'duplicate or unable to register'
					);
					return reply.redirect('/register');
				});
		}
	);

	fastify.get('/logout', async (request, reply) => {
		if (!request.session.isAuth) return reply.redirect('/');
		request.destroySession((err) => {
			if (err) {
				reply.status(500);
				return reply.send('Internal Server Error: ES1');
			} else {
				return reply.redirect('/');
			}
		});
	});
}

export default routes;
