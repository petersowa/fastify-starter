import axios, { AxiosResponse } from 'axios';
import QuotesModel, { QuotesInterface, Quote } from '../models/quotesModel';
import { HashCache, HashData } from '../utils/hash-cache';
import { RapidStatsResult } from './types';

const apiToken = process.env.IEX_TOKEN;
const iexURL = process.env.IEX_URL;
const rapidURL = process.env.RAPIDAPI_URL;
const rapidHost = process.env.RAPIDAPI_HOST;
const rapidKey = process.env.RAPIDAPI_KEY;

const quoteCache = new HashCache<Quote>();
const statsCache = new HashCache<RapidStatsResult>();

function calcScore(stats: RapidStatsResult): number | string {
	try {
		const { financialData, price } = stats;
		const sharePrice = financialData.currentPrice.raw;
		const marketCap = price.marketCap.raw;
		const revenue = financialData.totalRevenue.raw;
		const operatingMargin = financialData.operatingMargins.raw;
		const revenueGrowth = financialData.revenueGrowth.raw;
		const cash = financialData.totalCash.raw;
		const debt = financialData.totalDebt.raw;

		const revPerMCap = revenue / marketCap;
		const revPerMCapPerOpMargin = revPerMCap * operatingMargin;
		const tDebtPerRev = (cash - debt) / revenue;
		const facScore =
			500 * revPerMCapPerOpMargin +
			500 * operatingMargin * revPerMCap +
			150 * revenueGrowth * revPerMCap +
			100 * tDebtPerRev;

		console.log({
			facScore,
			revPerMCap,
			revPerMCapPerOpMargin,
			tDebtPerRev,
			revenue,
			marketCap,
			operatingMargin,
			revenueGrowth,
			cash,
			debt,
		});
		return facScore;
	} catch (err) {
		return 'not found';
	}
}

async function fetchStats(
	symbol: string,
	date?: string
): Promise<RapidStatsResult | null> {
	let stats: AxiosResponse<RapidStatsResult> | null = null;
	let facScore: number | string;

	try {
		const cacheStats: HashData<
			RapidStatsResult
		> | null = statsCache.getCache(symbol);

		if (cacheStats && cacheStats.data) {
			console.log('stats cache HIT');
			cacheStats.data.facScore = calcScore(cacheStats.data);
			return cacheStats.data;
		}

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

		if (stats.data) {
			stats.data.facScore = calcScore(stats.data);
			statsCache.setCache(symbol, stats.data);
			return stats.data;
		}
	} catch (err) {
		console.error('ERROR: fetching stats', { err });
		return null;
	}
	console.error('UNABLE to FETCH STATS');
	return null;
}

async function fetchQuote(
	symbol: string,
	date?: string
): Promise<Quote | null> {
	// let quote: AxiosResponse<Quote> | null = null;
	// let stats: AxiosResponse<RapidStatsResult> | null = null;

	try {
		const cacheData: HashData<Quote> | null = quoteCache.getCache(symbol);
		if (cacheData) {
			console.log('hit');
			return cacheData.data || null;
		}
		const [quote, stats] = await Promise.all([
			axios.get<Quote>(
				`${iexURL}/stock/${symbol}/quote?token=${apiToken}`
			),
			null,
		]);
		if (quote) {
			// quote.data.stats=stats;
			quoteCache.setCache(symbol, quote.data);
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
