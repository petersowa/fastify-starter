import axios, { AxiosResponse } from 'axios';
import * as fastify from 'fastify';

const MINUTES = 60 * 1000;
const HOURS = 60 * MINUTES;
const QUOTE_AGE = 4 * HOURS;

interface HashTable {
	key: string;
	data?: {};
	time: number;
}

const hashTable: HashTable[] = new Array(541);

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

function getCache(key: string): HashTable | null {
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
				if (!request.session.username) reply.redirect('/login'); // check if return is needed
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

async function getQuote(symbol: string): Promise<StockData | null> {
	let quote: AxiosResponse<StockData> | null = null;

	try {
		const cacheData: HashTable | null = getCache(symbol);
		if (cacheData) {
			console.log('hit');
			return cacheData.data as StockData;
		}
		quote = await axios.get<StockData>(
			`${iexURL}/stock/${symbol}/quote?token=${apiToken}`
		);
		setCache(symbol, quote.data);
		console.log({ hashTable });
		return quote.data;
	} catch (err) {
		console.error(err.message);
		return null;
	}
}

export default routes;