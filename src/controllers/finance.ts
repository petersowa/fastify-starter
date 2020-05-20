import axios, { AxiosResponse } from 'axios';
import QuotesModel, { QuotesInterface } from '../models/quotesModel';
import { getCache, setCache, HashTable, StockData } from '../utils/hash-cache';

const apiToken = process.env.IEX_TOKEN;
const iexURL = process.env.IEX_URL;

export async function fetchQuote(symbol: string): Promise<StockData | null> {
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
