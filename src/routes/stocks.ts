import axios, { AxiosResponse } from 'axios';
import * as fastify from 'fastify';
import { checkSessionAuth } from '../controllers/protected';
import QuotesModel, { QuotesInterface } from '../models/quotesModel';
import WatchList from '../models/watchList';
import { UserModel } from '../models/userModel';

const MINUTES = 60 * 1000;
const HOURS = 60 * MINUTES;
const QUOTE_AGE = 0.5 * HOURS;

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
		if (isExpired(hashTable[index].time)) return null;
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

	fastify.get(
		'/watchlist',
		{
			preHandler: checkSessionAuth,
		},
		async (request, reply) => {
			const wl = await WatchList.findOne({
				user: request.session.userId,
			});
			if (!wl) return null;
			return wl.symbols;
		}
	);

	fastify.post(
		'/watchlist',
		{
			preHandler: checkSessionAuth,
		},
		async (request, reply) => {
			const { watchList } = request.body;

			WatchList.findOne({ user: request.session.userId })
				.then((doc) => {
					if (doc) {
						console.log('found watch list', doc);
						doc.symbols = watchList;
						doc.save()
							.then((result) => {
								console.log('updated watchlist', result);
							})
							.catch((err) => {
								throw new Error(err);
							});
					} else {
						const newWatchlist = new WatchList({
							user: request.session.userId,
							symbols: watchList,
						});

						newWatchlist
							.save()
							.then((result: {}) => {
								console.log({ watchList: result });
								return { status: result };
							})
							.catch((err: Error) => {
								console.error({ watchlist: err });
							});
					}
				})
				.catch((err) => console.log({ postWatchlistError: err }));
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

function getLatestSavedQuote(symbol: string): Promise<QuotesInterface | null> {
	return new Promise((resolve, reject) => {
		QuotesModel.findOne({ symbol })
			.sort({ date: -1 })
			.then((quote) => {
				resolve(quote);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

async function updateQuoteDB(symbol: string, data: {}): Promise<boolean> {
	const quote = await getLatestSavedQuote(symbol);
	if (quote) {
		if (Date.now() - Date.parse(quote.date) < 1000 * 60 * 1) {
			// console.log('found recent quote');
			return new Promise((resolve, reject) => resolve(false));
		}
	}
	return new Promise((resolve, reject) => {
		const quote = new QuotesModel({
			symbol,
			data,
		});
		quote
			.save()
			.then((doc) => {
				resolve(true);
				// console.log('saved quote');
			})
			.catch((err) => {
				reject(err);
				console.error({ QuoteModel: err.message });
			});
	});
}

export default routes;
