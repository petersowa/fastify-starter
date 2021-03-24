import { checkSessionAuth } from './controllers/protected';
import { updateWatchlist, getWatchlist } from './controllers/watchlist';
import { getQuote, getStats, getHistoricalQuote } from './controllers/quote';
import {
	getAccounts,
	addHoldingPosition,
	deletePosition,
	updateHoldingPosition,
	addHoldingsAccount,
	deleteHoldingsAccount,
} from './controllers/accounts';
import { FastifyInstance } from 'fastify';

const options = { preHandler: checkSessionAuth };

async function routes(fastify: FastifyInstance) {
	fastify.get('/quote/:symbol', options, getQuote);
	fastify.get('/quote/:symbol/:date', options, getHistoricalQuote);
	fastify.get('/stats/:symbol', options, getStats);
	fastify.get('/watchlist', options, getWatchlist);
	fastify.post('/watchlist', options, updateWatchlist);
	fastify.post('/holdings', options, addHoldingsAccount);
	fastify.delete('/holdings', options, deleteHoldingsAccount);
	fastify.get('/account', options, getAccounts);
	fastify.put('/account', options, addHoldingPosition);
	fastify.delete('/account', options, deletePosition);
	fastify.patch('/account', options, updateHoldingPosition);
}

export default routes;
