import axios, { AxiosResponse } from 'axios';
import * as fastify from 'fastify';

interface Query {
	foo?: number;
}

interface Params {
	symbol: string;
}

interface Body {
	baz?: string;
}

interface Headers {
	a?: string;
}

interface StockData {
	[key: string]: string;
}

async function routes(
	fastify: fastify.FastifyInstance,
	_options: {}
): Promise<void> {
	fastify.get<Query, Params, Body, Headers>(
		'/quote/:symbol',
		{
			async preHandler(request, reply) {
				if (!request.session.username) reply.redirect('/login');
				return;
			},
		},
		async (request, reply): Promise<StockData | null> => {
			console.log(request.params.symbol);
			return getQuote(request.params.symbol);
		}
	);
}

const apiToken = process.env.IEX_TOKEN;
const iexURL = process.env.IEX_URL;

// console.log({ apiToken, iexURL });

async function getQuote(symbol: string): Promise<StockData | null> {
	let quote: AxiosResponse<StockData> | null = null;

	try {
		quote = await axios.get<StockData>(
			`${iexURL}/stock/${symbol}/quote?token=${apiToken}`
		);
		// console.log(quote.data);
		return quote.data;
	} catch (err) {
		console.log(err.message);
		return null;
	}
}

export default routes;
