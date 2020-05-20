import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';

import { Quote } from '../models/quotesModel';
import { fetchQuote } from './finance';

export async function getQuote(
	request: FastifyRequest,
	reply: FastifyReply<ServerResponse>
): Promise<Quote | null> {
	console.log(request.params.symbol);
	const quote = await fetchQuote(request.params.symbol);
	if (quote === null) reply.status(404).send({ error: 'unable to get data' });
	return quote;
}
