import axios, { AxiosRequestConfig } from 'axios';
import chalk from 'chalk';
import QuotesModel, { Quote } from '../models/quotesModel';
import StatsModel from '../models/statsModel';
import { HashCache, HashData } from '../utils/hash-cache';
import type { RapidStatsResult } from './types';
import type { Interface } from '../models/model-types';

const MAXAGE_STATS = 1000 * 60 * 60 * 24 * 30;
const MAXAGE_QUOTE = 1000 * 60 * 5;

const apiToken = process.env.IEX_TOKEN;
const iexURL = process.env.IEX_URL;
const rapidURL = process.env.RAPIDAPI_URL;
const rapidHost = process.env.RAPIDAPI_HOST;
const rapidKey = process.env.RAPIDAPI_KEY;

const quoteCache = new HashCache<Quote>();
const statsCache = new HashCache<RapidStatsResult>(MAXAGE_STATS, 997);

function calcScore(stats: RapidStatsResult): number | string {
	try {
		const { financialData, price } = stats;
		// const sharePrice = financialData.currentPrice.raw;
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

async function fetchStats(symbol: string): Promise<RapidStatsResult | null> {
	console.log('FETCH STATS START');

	const statsData = await cacheFetch<RapidStatsResult>({
		source: {
			method: 'get',
			url: `${rapidURL}/get-statistics?region=US&symbol=${symbol
				.split('.')
				.join('-')}`,
			headers: {
				'x-rapidapi-key': rapidKey,
				'x-rapidapi-host': rapidHost,
				useQueryString: true,
			},
			timeout: 8000,
		},
		maxAge: MAXAGE_STATS,
		cache: statsCache,
		dbGetFn: getLatestSavedStats,
		dbUpdateFn: updateStatsDB,
		key: symbol,
	});

	if (statsData) {
		if (statsData.quoteType.quoteType === 'EQUITY')
			statsData.facScore = calcScore(statsData);
		statsCache.setCache(symbol, statsData);
		return statsData;
	}

	return statsData;
}

async function fetchQuote(
	symbol: string,
	date?: string
): Promise<Quote | null> {
	if (date) {
		console.error('historical date not implemented');
		return null;
	}
	return cacheFetch<Quote>({
		source: {
			method: 'get',
			url: `${iexURL}/stock/${symbol}/quote?token=${apiToken}`,
			timeout: 2000,
		},
		maxAge: MAXAGE_QUOTE,
		cache: quoteCache,
		dbGetFn: getLatestSavedQuote,
		dbUpdateFn: updateQuoteDB,
		key: symbol,
	});
}

async function cacheFetch<T>(options: {
	source: AxiosRequestConfig;
	maxAge: number;
	cache: HashCache<T>;
	dbGetFn: (key: string) => Promise<Interface<T> | null>;
	dbUpdateFn: (key: string, data: T) => Promise<boolean>;
	key: string;
}): Promise<T | null> {
	try {
		const cacheData: HashData<T> | null = options.cache.getCache(
			options.key
		);
		if (cacheData) {
			console.log(chalk.bgGreen('Mem Cache Hit', options.key));
			return cacheData.data || null;
		}

		const dbResult = await options.dbGetFn(options.key);
		console.log({ dbResult: dbResult?.id, key: options.key });
		if (
			dbResult &&
			dbResult.data &&
			!isExpiredData(dbResult.date.toString(), options.maxAge)
		) {
			options.cache.setCache(options.key, dbResult.data);
			console.log(chalk.bgYellow('DB Cache Hit', options.key));
			return dbResult.data;
		}

		const result = await axios<T>(options.source);
		if (result) {
			console.log(chalk.bgRed('FETCHED', options.key));
			options.cache.setCache(options.key, result.data);
			await options.dbUpdateFn(options.key, result.data);
			return result.data;
		}
	} catch (error) {
		console.error((error as Error).message);
		return null;
	}
	return null;
}

function getLatestSavedQuote(symbol: string): Promise<Interface<Quote> | null> {
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
		if (!isExpiredData(quote.date.toString(), MAXAGE_QUOTE)) {
			console.log('found recent quote', symbol);
			return false;
		}
		if (quote.data.latestUpdate === data.latestUpdate) {
			console.log('same quote', symbol);
			return false;
		}
	}

	try {
		console.log('UPDATEQUOTEDB', symbol);
		const quoteModel = new QuotesModel({
			symbol,
			data,
		});
		await quoteModel.save();
		return true;
	} catch (error) {
		return Promise.reject((error as Error).message);
	}
}

async function getLatestSavedStats(
	symbol: string
): Promise<Interface<RapidStatsResult> | null> {
	try {
		const data = await StatsModel.findOne({ symbol }).sort({ date: -1 });
		return data;
	} catch (errorStatsModelFindOne) {
		if (errorStatsModelFindOne instanceof Error)
			console.error(errorStatsModelFindOne.message);
	}
	return null;
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
	try {
		const savedStats = await getLatestSavedStats(symbol);
		if (savedStats) {
			if (!isExpiredData(savedStats.date.toString(), MAXAGE_STATS)) {
				console.log('found recent stats in db');
				return false;
			}
		}
		const stats = new StatsModel({
			symbol,
			data,
		});
		console.log({ SavingStats: stats.id });
		await stats.save();
		return true;
	} catch (updateStatsDBError) {
		console.error({ updateStatsDBError });
	}
	return false;
}

export { fetchStats, fetchQuote };
