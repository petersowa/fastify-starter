import dbInstance from '../utils/db';
import { Schema } from 'mongoose';
import type { Interface } from './model-types';

export interface Quote {
	symbol: string;
	companyName: string;
	primaryExchange: string;
	calculationPrice: string;
	open: number;
	openTime: number;
	openSource: string;
	close: number;
	closeTime: number;
	closeSource: string;
	high: number;
	highTime: number;
	highSource: string;
	low: number;
	lowTime: number;
	lowSource: string;
	latestPrice: number;
	latestSource: string;
	latestTime: string;
	latestUpdate: number;
	latestVolume: number;
	iexRealtimePrice: number;
	iexRealtimeSize: number;
	iexLastUpdated: number;
	delayedPrice: number;
	delayedPriceTime: number;
	oddLotDelayedPrice: number;
	oddLotDelayedPriceTime: number;
	extendedPrice: number;
	extendedChange: number;
	extendedChangePercent: number;
	extendedPriceTime: number;
	previousClose: number;
	previousVolume: number;
	change: number;
	changePercent: number;
	volume: number;
	iexMarketPercent: number;
	iexVolume: number;
	avgTotalVolume: number;
	iexBidPrice: number;
	iexBidSize: number;
	iexAskPrice: number;
	iexAskSize: number;
	iexOpen: number;
	iexOpenTime: number;
	iexClose: number;
	iexCloseTime: number;
	marketCap: number;
	peRatio: number;
	week52High: number;
	week52Low: number;
	ytdChange: number;
	lastTradeTime: number;
	currency: string;
	isUSMarketOpen: boolean;
}

const schema: Schema<Interface<Quote>> = new Schema({
	symbol: { type: String, required: true },
	date: { type: Date, default: Date.now },
	data: { type: Object },
});

const QuoteModel = dbInstance.createModel<Interface<Quote>>('Quote', schema);

export default QuoteModel;
