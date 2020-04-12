import fastify from 'fastify';
import path from 'path';

import { Server, IncomingMessage, ServerResponse } from 'http';
import authRoutes from '../routes/auth';
import helmet from 'fastify-helmet';
import formBody from 'fastify-formbody';
import socketIo from './socket-io';

import 'fastify-csrf';

import registerHandlebars from './handlebars';
import registerSessions from './sessions';

const fastifyCSRF = require('fastify-csrf');

const PORT: number = parseInt(process.env.PORT || '3000', 10);

const app: fastify.FastifyInstance<
	Server,
	IncomingMessage,
	ServerResponse
> = fastify({ logger: false, http2: false });

app.register(helmet);

registerSessions(app);

app.register(fastifyCSRF, {
	key: '_csrf',
	ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
});

const appState = { modal: 'loginForm' };

app.addHook('preHandler', (request, reply, next) => {
	console.log('preHandler', appState);
	request.session.appState = appState;
	console.log(request.session.appState);

	if (!request.session.csrfToken) {
		request.session.csrfToken = request.csrfToken();
	}
	// console.log('CSRF:', request.session);
	next();
});

app.register(formBody);

socketIo.init(app.server);

// add static routes
app.register(require('fastify-static'), {
	root: path.join(__dirname, '..', '..', 'public'),
	prefix: '/',
});

registerHandlebars(app);
app.register(authRoutes, { prefix: '/auth' }); // add auth routes

app.listen(PORT, '0.0.0.0', (err) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
});
