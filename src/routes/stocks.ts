import * as fastify from 'fastify';
import { checkSessionAuth } from '../controllers/protected';
import { updateWatchlist, getWatchlist } from '../controllers/watchlist';
import { getQuote, getHistoricalQuote } from '../controllers/quote';
import {
	getAccounts,
	patchHoldings,
	deletePosition,
} from '../controllers/accounts';

const options = { preHandler: checkSessionAuth };

async function routes(
	fastify: fastify.FastifyInstance,
	_options: {}
): Promise<void> {
	fastify.get('/quote/:symbol', options, getQuote);
	fastify.get('/quote/:symbol/:date', options, getHistoricalQuote);
	fastify.get('/watchlist', options, getWatchlist);
	fastify.post('/watchlist', options, updateWatchlist);
	fastify.get('/accounts', options, getAccounts);
	fastify.patch('/account', options, patchHoldings);
	fastify.delete('/account', options, deletePosition);
}

export default routes;
