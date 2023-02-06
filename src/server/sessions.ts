import { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
// import 'fastify-session'; // session types

// import mongoose from 'mongoose';

import fastifySession, { SessionStore } from '@fastify/session';
import type { Flash } from './flash';
import { ObjectId } from '@fastify/mongodb';
import MongoStore from 'connect-mongo';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';

const { MONGODB_NAME, SESSION_SECRET, NODE_ENV, REDIS_CONNECT } = process.env;
if (!REDIS_CONNECT) throw new Error('no redis');

const RedisStore = connectRedis(fastifySession as any);
console.log({ RedisStore });
const redisClient = new Redis(REDIS_CONNECT);
// console.log({ redisClient });
const redisStore = new RedisStore({
	client: redisClient,
}) as unknown as SessionStore;

async function logRedis() {
	const stream = redisClient.scanStream({ match: '*', count: 100 });

	stream.on('data', function (resultKeys) {
		resultKeys.forEach((key: string) => console.log({ key }));
	});

	await redisClient.set('hello', 'world');

	const data = await redisClient.get('', (err, result) => {
		console.log({ result });
	});
	console.log({ data });
}

logRedis();
export interface Session {
	isInitialLoad: boolean;
	flash: Flash;
	appState: {
		modal: string;
		info: Record<string, unknown>;
		timeStamp: Date;
	};
	isAuth: boolean;
	username: string;
	userId: ObjectId;
}

// import FastifySessionPlugin from '@fastify/session';
// fastifySession.MemoryStore = {}; // MongoStore fails if not added

const MAX_SESSION_AGE = 2 * 24 * 60 * 60 * 1000;

// interface Session {
// 	user_id: string;
// 	other_key: your_prefer_type;
// 	id?: number;
// }

const register = (
	app: FastifyInstance<Server, IncomingMessage, ServerResponse>
): void => {
	if (!SESSION_SECRET) throw new Error('no session secret found');
	console.log('REGISTER FASTIFY SESSION');
	// console.log({ app, redisStore: redisStore });
	app.register(fastifySession, {
		cookieName: 'qqSessionId',
		secret: SESSION_SECRET,
		saveUninitialized: false,
		cookie: {
			path: '/',
			secure: NODE_ENV === 'production',
			maxAge: MAX_SESSION_AGE,
		},
		store: redisStore,
		// store: MongoStore.create({
		// 	mongoUrl: process.env.MONGODB_NAME,
		// }) as unknown as SessionStore,
	});
};

export default register;
