import fastify from 'fastify';
import fastifyCookie from 'fastify-cookie';

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

const PORT: number = parseInt(process.env.PORT || '3999', 10);

const app: fastify.FastifyInstance<
	Server,
	IncomingMessage,
	ServerResponse
> = fastify({
	logger: process.env.NODE_ENV !== 'production',
	http2: false,
	trustProxy: true,
});

console.log('IS_PROD', process.env.NODE_ENV);

app.register(helmet);

app.register(fastifyCookie);
app.register(formBody);
registerSessions(app);

// app.addHook('preHandler', (request, reply, next) => {
// 	console.log('PREHANDLER', {
// 		ips: request.ips,
// 		// userId: request.session.userId,
// 		// body: request.body,
// 	});
// 	next();
// });

app.register(fastifyCSRF, {
	key: '_csrf',
	ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
});

app.addHook('preHandler', (request, reply, next) => {
	request.session.appState = { ...appState, timeStamp: Date.now() };
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

const flashState = flash();

app.setErrorHandler((err, request, reply) => {
	console.error({ ServerError: err });
	reply.status(500).send({ error: err.message });
	return;
});

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
