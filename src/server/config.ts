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

const fastifyCSRF = require('fastify-csrf');

const PORT: number = parseInt(process.env.PORT || '3000', 10);

const app: fastify.FastifyInstance<
	Server,
	IncomingMessage,
	ServerResponse
> = fastify({ logger: false, http2: false });

interface Flash {
	add: (type: string, message: string) => void;
	get: (type: string) => string;
}

const flash = (): Flash => {
	interface FlashMessagesType {
		[propName: string]: string[] | undefined;
	}
	const messages: FlashMessagesType = {};

	function add(type: string, message: string): void {
		if (!(type in messages)) messages[type] = [];
		messages[type]?.push(message);
		console.log('flash add', { messages });
	}
	function get(type: string): string {
		console.log('flash get', { messages });
		if (!(type in messages)) return '';
		const typeMessages = messages[type] || [''];
		return typeMessages.pop() || '';
	}
	return { add, get };
};

app.register(helmet);

registerSessions(app);

app.register(fastifyCSRF, {
	key: '_csrf',
	ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
});

const appState = { modal: 'loginForm' };
const flashState = flash();

app.addHook('preHandler', (request, reply, next) => {
	console.log('preHandler', appState);
	request.session.appState = appState;
	request.session.flash = flashState;
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
app.register(stockRoutes, { prefix: '/stocks' }); // add auth routes

app.listen(PORT, '0.0.0.0', (err) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
});
