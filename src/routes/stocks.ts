import axios, { AxiosResponse } from 'axios';
import * as fastify from 'fastify';
import { checkSessionAuth } from '../controllers/protected';
import QuotesModel from '../models/quotesModel';

const MINUTES = 60 * 1000;
const HOURS = 60 * MINUTES;
const QUOTE_AGE = 4 * HOURS;

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
interface HashTable<T> {
	key: string;
	data?: T;
	time: number;
}

const hashTable: HashTable<StockData>[] = new Array(541);

const ageStamp = (interval: number = QUOTE_AGE): number => {
	return Math.floor(Date.now() / interval);
};

const isExpired = (
	timeStamp: number,
	interval: number = QUOTE_AGE
): boolean => {
	if (Date.now() - timeStamp > interval) return true;
	return false;
};

const hashStringToInt: (str: string) => number = (str) => {
	let hash = 19;
	for (const char of str) {
		hash = (127 * hash + char.charCodeAt(0)) % hashTable.length;
	}
	return hash;
};

function getCache(key: string): HashTable<{}> | null {
	const index = hashStringToInt(key);
	if (index in hashTable) {
		const data = hashTable[index];
		if (data.key === key) return data;
		console.log('hash collision');
	}
	return null;
}

function setCache(key: string, data: {}): boolean {
	const index = hashStringToInt(key);
	if (index in hashTable) {
		if (isExpired(hashTable[index].time)) {
			hashTable[index] = { key, data, time: Date.now() };
			return true;
		}
		return false;
	}
	hashTable[index] = { key, data, time: Date.now() };
	return true;
}

async function routes(
	fastify: fastify.FastifyInstance,
	_options: {}
): Promise<void> {
	fastify.get<Query, Params, Body, Headers>(
		'/quote/:symbol',
		{
			preHandler: checkSessionAuth,
		},
		async (request, reply): Promise<StockData | null> => {
			console.log(request.params.symbol);
			const quote = await getQuote(request.params.symbol);
			if (quote === null)
				reply.status(404).send({ error: 'unable to get data' });
			return quote;
		}
	);
}

const apiToken = process.env.IEX_TOKEN;
const iexURL = process.env.IEX_URL;

async function getQuote(symbol: string): Promise<StockData | null> {
	let quote: AxiosResponse<StockData> | null = null;

	try {
		const cacheData: HashTable<StockData> | null = getCache(symbol);
		if (cacheData) {
			console.log('hit');
			return cacheData.data || null;
		}
		quote = await axios.get<StockData>(
			`${iexURL}/stock/${symbol}/quote?token=${apiToken}`
		);
		setCache(symbol, quote.data);
		await updateQuoteDB(symbol, quote.data);
		return quote.data;
	} catch (err) {
		console.error('Fetch Quote Error: ', (err as Error).message);
		return null;
	}
}

function updateQuoteDB(symbol: string, data: {}): Promise<boolean> {
	return new Promise((resolve, reject) => {
		const quote = new QuotesModel({
			symbol,
			data,
		});
		quote
			.save()
			.then((doc) => {
				resolve(true);
				console.log({ savedQuote: data });
			})
			.catch((err) => {
				resolve(false);
				console.error({ QuoteModel: err.message });
			});
	});
}

export default routes;
