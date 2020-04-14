import * as fastify from 'fastify';

import { Server, IncomingMessage, ServerResponse } from 'http';
import { UserModel } from '../models/userModel';

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
		UserModel.findOne({ email: username })
			.then(async (user) => {
				if (user) {
					const isValidPW = await user.validatePassword(password);
					if (isValidPW) {
						// console.log({ user, isValidPW, username });
						request.session.isAuth = true;
						request.session.username = username;
						return reply.redirect('/');
					} else {
						console.log('password invalid');
						return reply.redirect('/login');
					}
				} else {
					console.log('user not found');
					return reply.redirect('/login');
				}
			})
			.catch((err) => {
				console.log({ err });
				return reply.redirect('/login');
			});
	});

	fastify.post('/register', async (request, reply) => {
		const {
			password,
			username,
			'password-match': passwordMatch,
		} = request.body;
		console.log(username, password, passwordMatch);
		if (password !== passwordMatch) {
			// request.flash('auth', 'Passwords do not match.');
			request.session.flash.add('auth', 'Passwords do not match');
			return reply.redirect('/register');
		}
		const newUser = new UserModel({
			name: username,
			password: password,
			email: username,
		});
		newUser
			.save()
			.then((result: {}) => {
				console.log('created user', result);
				return reply.redirect('/');
			})
			.catch((err: Error) => {
				console.error(err);
				request.session.flash.add('auth', err.message);
				return reply.redirect('/register');
			});
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
