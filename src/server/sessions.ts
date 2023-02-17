import { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

import fastifySession, { SessionStore } from '@fastify/session';
import type { Flash } from './flash';
import { ObjectId } from '@fastify/mongodb';

import Redis from 'ioredis';
import connectRedis from 'connect-redis';

declare module 'fastify' {
	interface Session {
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
}

const { SESSION_SECRET, NODE_ENV, REDIS_CONNECT } = process.env;
if (!REDIS_CONNECT) throw new Error('no redis connect string');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RedisStore = connectRedis(fastifySession as any);
console.log({ RedisStore });
const redisClient = new Redis(REDIS_CONNECT);
const redisStore = new RedisStore({
	client: redisClient,
}) as unknown as SessionStore;
const MAX_SESSION_AGE = 2 * 24 * 60 * 60 * 1000;

const register = (
	app: FastifyInstance<Server, IncomingMessage, ServerResponse>
): void => {
	if (!SESSION_SECRET) throw new Error('no session secret found');
	console.log('REGISTER FASTIFY SESSION');
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
	});
};

async function logRedis() {
	const stream = redisClient.scanStream({ match: '*', count: 100 });

	stream.on('data', function (resultKeys) {
		resultKeys.forEach(async (key: string) => {
			try {
				const rawData = await redisClient.get(key);
				if (rawData) {
					process.env.NODE_ENV == 'development' &&
						console.log({ rawData });
					const data = JSON.parse(rawData);
					if (data?.cookie?.expires && data?.isAuth) {
						console.log(key, data.username);
						const isExpired =
							new Date(data.cookie.expires) < new Date();
						console.log(data.cookie.expires, { isExpired });
					}
				}
			} catch (logRedis_error) {
				console.log({ logRedis_error });
			}
		});
	});
}

logRedis();

export default register;
