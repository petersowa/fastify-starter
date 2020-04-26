import fastify from 'fastify';
import path from 'path';

import { Server, IncomingMessage, ServerResponse } from 'http';
import authRoutes from '../routes/auth';
import stockRoutes from '../routes/stocks';
import helmet from 'fastify-helmet';
import formBody from 'fastify-formbody';
import socketIo from './socket-io';

import 'fastify-csrf';

import registerHandlebars from './handlebars';
import registerSessions from './sessions';
import { WebStatsModel } from '../models/webStats';

import flash from './flash';
import appState from './app-state';

const fastifyCSRF = require('fastify-csrf');

const PORT: number = parseInt(process.env.PORT || '3000', 10);

const app: fastify.FastifyInstance<
	Server,
	IncomingMessage,
	ServerResponse
> = fastify({ logger: false, http2: false, trustProxy: true });

app.register(helmet);

registerSessions(app);

app.register(fastifyCSRF, {
	key: '_csrf',
	ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
});

const flashState = flash();

app.setErrorHandler((err, request, reply) => {
	console.error({ ServerError: err });
	reply.status(500).send({ error: err.message });
	return;
});

app.addHook('preHandler', (request, reply, next) => {
	request.session.appState = { ...appState, timeStamp: Date.now() };
	console.log('preHandler', request.ips);
	request.session.flash = flashState;
	request.session.appState.info.setInfo({
		ip: request.ip,
		hostname: request.hostname,
		header: request.headers['user-agent'],
		referer: request.headers['referer'],
	});

	if (!request.session.csrfToken) {
		request.session.csrfToken = request.csrfToken();

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
						.catch((err) => {
							console.error({ WebStatsModel: err.message });
						});
				}
			})
			.catch((err) => {
				console.error({ WebStatsModel: err.message });
			});
	}

	next();
});

// A simple plugin for Fastify that adds a content type parser for the content type application/x-www-form-urlencoded.
app.register(formBody);

// add static routes
app.register(require('fastify-static'), {
	root: path.join(__dirname, '..', '..', 'public'),
	prefix: '/',
});

registerHandlebars(app);

app.register(authRoutes, { prefix: '/auth' }); // add auth routes
app.register(stockRoutes, { prefix: '/stocks' }); // add auth routes

socketIo.init(app.server);

app.listen(PORT, '0.0.0.0', (err) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
});
