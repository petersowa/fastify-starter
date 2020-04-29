import fastify from 'fastify';
import fastifyCookie from 'fastify-cookie';
import { Server, IncomingMessage, ServerResponse } from 'http';
import 'fastify-session'; // session types

const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

const fastifySession = require('fastify-session');
fastifySession.MemoryStore = {}; // MongoStore fails if not added
const store = MongoStore(fastifySession);

const MAX_SESSION_AGE = 2 * 24 * 60 * 60 * 1000;

const register = (
	app: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>
): void => {
	app.register(fastifyCookie);
	app.register(fastifySession, {
		cookieName: 'qqSessionId',
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: process.env.NODE_ENV === 'production',
			maxAge: MAX_SESSION_AGE,
		},
		store: new store({ mongooseConnection: mongoose.connection }),
	});
};

export default register;
