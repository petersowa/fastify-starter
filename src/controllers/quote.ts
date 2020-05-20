import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';

import { StockData } from '../utils/hash-cache';
import { fetchQuote } from './finance';

export async function getQuote(
	request: FastifyRequest,
	reply: FastifyReply<ServerResponse>
): Promise<StockData | null> {
	console.log(request.params.symbol);
	const quote = await fetchQuote(request.params.symbol);
	if (quote === null) reply.status(404).send({ error: 'unable to get data' });
	return quote;
}
