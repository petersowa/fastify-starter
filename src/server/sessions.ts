import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import 'fastify-session'; // session types

// import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

import fastifySession from 'fastify-session';
import FastifySessionPlugin from 'fastify-session';
// fastifySession.MemoryStore = {}; // MongoStore fails if not added
// const store = MongoStore(session);

const MAX_SESSION_AGE = 2 * 24 * 60 * 60 * 1000;
const { MONGODB_NAME, SESSION_SECRET, NODE_ENV } = process.env;

const register = async (
	app: FastifyInstance<Server, IncomingMessage, ServerResponse>
): Promise<void> => {
	if (!SESSION_SECRET) throw new Error('no session secret found');
	app.register(
		fastifySession as FastifyPluginCallback<FastifySessionPlugin.Options>,
		{
			cookieName: 'qqSessionId',
			secret: SESSION_SECRET,
			saveUninitialized: false,
			cookie: {
				path: '/',
				secure: NODE_ENV === 'production',
				maxAge: MAX_SESSION_AGE,
			},
			store: new MongoStore({
				// mongooseConnection: mongoose.connection,
				mongoUrl: MONGODB_NAME,
			}),
		}
	);
};

export default register;
