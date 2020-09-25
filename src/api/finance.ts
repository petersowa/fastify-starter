import axios, { AxiosResponse } from 'axios';
import chalk from 'chalk';
import QuotesModel, { QuotesInterface, Quote } from '../models/quotesModel';
import StatsModel, { StatsInterface } from '../models/statsModel';
import { HashCache, HashData } from '../utils/hash-cache';
import { RapidStatsResult } from './types';

const MAXAGE_STATS = 1000 * 60 * 60 * 24 * 30;
const MAXAGE_QUOTE = 1000 * 60 * 5;

const apiToken = process.env.IEX_TOKEN;
const iexURL = process.env.IEX_URL;
const rapidURL = process.env.RAPIDAPI_URL;
const rapidHost = process.env.RAPIDAPI_HOST;
const rapidKey = process.env.RAPIDAPI_KEY;

const quoteCache = new HashCache<Quote>();
const statsCache = new HashCache<RapidStatsResult>(MAXAGE_STATS, 997);

const missCache = chalk.bgRed.black;
const chalkData = chalk.yellow;

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
	let statsData: RapidStatsResult | null = null;

	try {
		const cacheStats: HashData<
			RapidStatsResult
		> | null = statsCache.getCache(symbol);

		if (cacheStats && cacheStats.data) {
			cacheStats.data.facScore = calcScore(cacheStats.data);
			return cacheStats.data;
		}

		const statsDB = await getLatestSavedStats(symbol);
		console.log(chalkData(statsDB?.date));
		if (
			statsDB &&
			statsDB.data &&
			!isExpiredData(statsDB.date, MAXAGE_STATS)
		) {
			statsData = statsDB.data;
			console.log('got stats from db');
		} else {
			console.log(missCache('FETCHING FROM YAHOO API', symbol));
			stats = await axios.get<RapidStatsResult>(
				`${rapidURL}/get-statistics?region=US&symbol=${symbol
					.split('.')
					.join('-')}`,
				{
					headers: {
						'x-rapidapi-key': rapidKey,
						'x-rapidapi-host': rapidHost,
						useQueryString: true,
					},
				}
			);
			if (stats && stats.data) {
				statsData = stats.data;
				await updateStatsDB(symbol, statsData);
			}
		}
		if (statsData) {
			if (statsData.quoteType.quoteType === 'EQUITY')
				statsData.facScore = calcScore(statsData);
			statsCache.setCache(symbol, statsData);
			return statsData;
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
			return cacheData.data || null;
		}

		const quoteDB = await getLatestSavedQuote(symbol);
		// console.log(chalkData(quoteDB?.date));
		if (
			quoteDB &&
			quoteDB.data &&
			!isExpiredData(quoteDB.date, MAXAGE_QUOTE)
		) {
			quoteCache.setCache(symbol, quoteDB.data);
			return quoteDB.data;
		}

		console.log(missCache('FETCHING FROM IEX API', symbol));
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
		if (!isExpiredData(quote.date, MAXAGE_QUOTE)) {
			console.log('found recent quote', symbol);
			return new Promise((resolve, reject) => resolve(false));
		}
		if (quote.data.latestUpdate === data.latestUpdate) {
			console.log('same quote', symbol);
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

function getLatestSavedStats(symbol: string): Promise<StatsInterface | null> {
	return new Promise((resolve, reject) => {
		StatsModel.findOne({ symbol })
			.sort({ date: -1 })
			.then((data) => {
				resolve(data);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

function isExpiredData(dataDate: string, maxAge: number): boolean {
	// console.log('check if expired', dataDate, maxAge);
	const isExpired = Date.now() - Date.parse(dataDate) > maxAge;
	// console.log({ isExpired });
	return isExpired;
}

async function updateStatsDB(
	symbol: string,
	data: RapidStatsResult
): Promise<boolean> {
	const stats = await getLatestSavedStats(symbol);
	if (stats) {
		if (!isExpiredData(stats.date, MAXAGE_STATS)) {
			console.log('found recent stats in db');
			return new Promise((resolve, reject) => resolve(false));
		}
	}
	return new Promise((resolve, reject) => {
		const stats = new StatsModel({
			symbol,
			data,
		});
		stats
			.save()
			.then((doc) => {
				resolve(true);
			})
			.catch((err) => {
				reject(false);
				console.error({ StatsModel: err.message });
			});
	});
}

export { fetchStats, fetchQuote };
