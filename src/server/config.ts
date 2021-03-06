import fastify from 'fastify';
import fastifyCookie from 'fastify-cookie';
import fastifyStatic from 'fastify-static';
import path from 'path';

import helmet from 'fastify-helmet';
import formBody from 'fastify-formbody';

import socketIo from './socket-io';
import authRoutes from '../routes/auth';
import stockRoutes from '../routes/stocks';
import registerHandlebars from './handlebars';
import registerSessions from './sessions';
import { WebStatsModel } from '../models/webStats';

import flash from './flash';
import appState from './app-state';

import fastifyCsrf from 'fastify-csrf';

const PORT: number = parseInt(process.env.PORT || '3999', 10);

const logger = false; //process.env.NODE_ENV !== 'production';

const app = fastify({
	logger,
	trustProxy: true,
});

console.log('ENV:', process.env.NODE_ENV);

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

app.register(fastifyCsrf, {
	sessionKey: '_csrf',
	sessionPlugin: 'fastify-session',
});

app.addHook('preHandler', async (request, reply) => {
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
						.catch((err: Error) => {
							console.error({ WebStatsModel: err.message });
						});
				}
			})
			.catch((err: Error) => {
				console.error({ WebStatsModel: err.message });
			});
	}

	// next();
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

app.listen(PORT, '0.0.0.0', (err) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
});
