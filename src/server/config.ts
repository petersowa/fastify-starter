import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import type { FastifyCookieOptions } from '@fastify/cookie';
import fastifyStatic from '@fastify/static';
import cors from '@fastify/cors';
import path from 'path';

import helmet from '@fastify/helmet';
import formBody from '@fastify/formbody';

import socketIo from './socket-io';
import authRoutes from '../routes/auth';
import stockRoutes from '../routes/stocks';
import registerHandlebars from './handlebars';
import registerSessions from './sessions';
import { WebStatsModel } from '../models/webStats';

import flash from './flash';
import appState from './app-state';

import fastifyCsrf from '@fastify/csrf-protection';

const PORT: number = parseInt(process.env.PORT || '3999', 10);

const logger = process.env.NODE_ENV !== 'production';

const app = fastify({
	logger,
	trustProxy: true,
});

console.log('ENV:', process.env.NODE_ENV);

async function setupFastify() {
	app.register(cors, {
		origin: [
			process.env.NODE_ENV === 'development'
				? 'http://localhost:4999'
				: '',
		],
	});
	app.register(helmet);

	// CHECK:ME
	app.register(fastifyCookie, {
		secret: process.env.COOKIE_SECRET,
	} as FastifyCookieOptions);
	app.register(formBody);
	registerSessions(app);

	app.register(fastifyCsrf, {
		sessionKey: '_csrf',
		sessionPlugin: '@fastify/session',
	});

	app.addHook('preHandler', async (request) => {
		// console.log(request.session.flash);
		request.session.appState = { ...appState, timeStamp: new Date() };
		request.session.flash = flashState;

		if (!request.session.isInitialLoad) {
			request.session.isInitialLoad = true;

			// track session
			WebStatsModel.findOne({ ip: request.ip })
				.then((doc) => {
					if (doc) {
						// console.log(doc);
						doc.count++;
						doc.save();
					} else {
						const webState = new WebStatsModel({
							ip: request.ip,
							header: request.headers['referer'],
							userAgent: request.headers['user-agent'],
						});
						webState
							.save()
							.then((doc) => {
								console.log({ WebStatsModel: doc });
							})
							.catch((err: Error) => {
								console.error({ WebStatsModel: err.message });
							});
					}
				})
				.catch((err: Error) => {
					console.error({ WebStatsModel: err.message });
				});
		}
	});

	const flashState = flash();

	app.setErrorHandler((err, request, reply) => {
		console.error({ ServerError: err });
		reply.status(500).send({ error: err.message });
		return;
	});

	// add static routes
	app.register(fastifyStatic, {
		root: path.join(__dirname, '..', '..', 'public'),
		prefix: '/',
	});

	registerHandlebars(app);

	app.register(authRoutes, { prefix: '/auth' }); // add auth routes
	app.register(stockRoutes, { prefix: '/stocks' }); // add auth routes

	socketIo.init(app.server);

	app.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
		if (err) {
			app.log.error(err);
			process.exit(1);
		}
	});
}

setupFastify();
