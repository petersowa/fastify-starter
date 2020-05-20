import * as fastify from 'fastify';
import { checkSessionAuth } from '../controllers/protected';
import { updateWatchlist, getWatchlist } from '../controllers/watchlist';
import { getQuote } from '../controllers/quote';

async function routes(
	fastify: fastify.FastifyInstance,
	_options: {}
): Promise<void> {
	fastify.get(
		'/quote/:symbol',
		{
			preHandler: checkSessionAuth,
		},
		getQuote
	);

	fastify.get(
		'/watchlist',
		{
			preHandler: checkSessionAuth,
		},
		getWatchlist
	);

	fastify.post(
		'/watchlist',
		{
			preHandler: checkSessionAuth,
		},
		updateWatchlist
	);
}

export default routes;
