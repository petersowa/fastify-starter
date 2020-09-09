import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';

import { Quote } from '../models/quotesModel';
import { fetchQuote, fetchStats } from './finance';
import { RapidStatsResult } from './types';

export async function getQuote(
	request: FastifyRequest,
	reply: FastifyReply<ServerResponse>
): Promise<Quote | null> {
	console.log(request.params.symbol);
	const quote = await fetchQuote(request.params.symbol);
	if (quote === null) reply.status(404).send({ error: 'unable to get data' });
	return quote;
}

export async function getStats(
	request: FastifyRequest,
	reply: FastifyReply<ServerResponse>
): Promise<RapidStatsResult | null> {
	console.log('getting stats for...', request.params.symbol);
	const stats = await fetchStats(request.params.symbol);
	if (stats === null) reply.status(404).send({ error: 'unable to get data' });
	return stats;
}

export async function getHistoricalQuote(
	request: FastifyRequest,
	reply: FastifyReply<ServerResponse>
): Promise<Quote | null> {
	console.log(request.params.symbol);
	const { symbol, date } = request.params;
	const quote = await fetchQuote(symbol, date);
	if (quote === null) reply.status(404).send({ error: 'unable to get data' });
	return quote;
}
