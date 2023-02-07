import { fetchQuote, fetchStats } from '../../api/finance';

export async function getQuote(request, reply) {
	const quote = await fetchQuote(request.params.symbol);
	if (quote === null)
		return reply.status(404).send({ error: 'unable to get data' });
	return quote;
}

export async function getStats(request, reply) {
	console.log('getting stats for...', request.params.symbol);
	const stats = await fetchStats(request.params.symbol);
	if (stats === null)
		return reply.status(404).send({ error: 'unable to get data' });
	return stats;
}

export async function getHistoricalQuote(request, reply) {
	console.log(request.params.symbol);
	const { symbol, date } = request.params;
	const quote = await fetchQuote(symbol, date);
	if (quote === null)
		return reply.status(404).send({ error: 'unable to get data' });
	return quote;
}
