// run with
// npx concurrently "npx tsc --watch qq-utils/redis.ts"  "node --watch qq-utils/redis.js"
// or
// npx tsc qq-utils/redis.ts && node qq-utils/redis.js
// Deps
// ioredis, dotenv

import * as dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config();

function QueryRedis() {
	const { REDIS_CONNECT } = process.env;

	if (!REDIS_CONNECT) throw new Error('No Redis Connect String');

	const redisClient = new Redis(REDIS_CONNECT);

	logRedis(redisClient);
}

QueryRedis();
const interval = setInterval(() => QueryRedis(), 10000);

async function logRedis(redisClient: Redis) {
	const stream = redisClient.scanStream({ match: '*', count: 100 });

	stream.on('data', function (resultKeys: string[]) {
		resultKeys.forEach(async (key: string) => {
			const data = await redisClient.get(key);
			console.log({ key, data });
		});
	});
}

process.on('SIGINT', () => {
	clearInterval(interval);
	console.log('bye, cleanup done.');
	process.exit();
});
