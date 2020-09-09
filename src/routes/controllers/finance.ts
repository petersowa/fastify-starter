import axios, { AxiosResponse } from 'axios';
import QuotesModel, { QuotesInterface, Quote } from '../../models/quotesModel';
import { getCache, setCache, HashData } from '../../utils/hash-cache';
import { RapidStatsResult } from './types';

const apiToken = process.env.IEX_TOKEN;
const iexURL = process.env.IEX_URL;
const rapidURL = process.env.RAPIDAPI_URL;
const rapidHost = process.env.RAPIDAPI_HOST;
const rapidKey = process.env.RAPIDAPI_KEY;

async function fetchStats(
	symbol: string,
	date?: string
): Promise<RapidStatsResult | null> {
	let stats: AxiosResponse<RapidStatsResult> | null = null;
	try {
		stats = await axios.get<RapidStatsResult>(
			`${rapidURL}/get-statistics?region=US&symbol=${symbol}`,
			{
				headers: {
					'x-rapidapi-key': rapidKey,
					'x-rapidapi-host': rapidHost,
					useQueryString: true,
				},
			}
		);

		return stats.data || null;
	} catch (err) {
		console.error('UNABLE to FETCH STATS', { err });
		return null;
	}
}

async function fetchQuote(
	symbol: string,
	date?: string
): Promise<Quote | null> {
	let quote: AxiosResponse<Quote> | null = null;

	try {
		const cacheData: HashData | null = getCache(symbol);
		if (cacheData) {
			console.log('hit');
			return cacheData.data || null;
		}
		quote = await axios.get<Quote>(
			`${iexURL}/stock/${symbol}/quote?token=${apiToken}`
		);
		if (quote) {
			setCache(symbol, quote.data);
			await updateQuoteDB(symbol, quote.data);
			return quote.data;
		}
	} catch (err) {
		console.error('Fetch Quote Error: ', (err as Error).message, { err });
		return null;
	}
	return null;
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

async function updateQuoteDB(symbol: string, data: Quote): Promise<boolean> {
	const quote = await getLatestSavedQuote(symbol);
	if (quote) {
		if (Date.now() - Date.parse(quote.date) < 1000 * 60 * 15) {
			console.log('found recent quote');
			return new Promise((resolve, reject) => resolve(false));
		}
		if (quote.data.latestUpdate === data.latestUpdate) {
			console.log('same quote');
			return false;
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
				reject(false);
				console.error({ QuoteModel: err.message });
			});
	});
}

export { fetchStats, fetchQuote };
