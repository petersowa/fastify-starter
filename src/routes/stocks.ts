import * as fastify from 'fastify';
import { checkSessionAuth } from '../controllers/protected';
import { updateWatchlist, getWatchlist } from '../controllers/watchlist';
import { getQuote, getHistoricalQuote } from '../controllers/quote';

const options = { preHandler: checkSessionAuth };

async function routes(
	fastify: fastify.FastifyInstance,
	_options: {}
): Promise<void> {
	fastify.get('/quote/:symbol', options, getQuote);
	fastify.get('/quote/:symbol/:date', options, getHistoricalQuote);
	fastify.get('/watchlist', options, getWatchlist);
	fastify.post('/watchlist', options, updateWatchlist);
}

export default routes;
