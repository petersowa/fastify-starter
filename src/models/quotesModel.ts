import dbInstance from '../utils/db';
import { Schema, Document, Types } from 'mongoose';

export interface Quote {
	avgTotalVolume: number;
	calculationPrice: string;
	change: number;
	changePercent: number;
	close: null | string;
	closeSource: string;
	closeTime: null | string;
	companyName: string;
	delayedPrice: null | string;
	delayedPriceTime: null | string;
	extendedChange: null | string;
	extendedChangePercent: null | string;
	extendedPrice: null | string;
	extendedPriceTime: null | string;
	high: null | string;
	highSource: string;
	highTime: number;
	iexAskPrice: number;
	iexAskSize: number;
	iexBidPrice: number;
	iexBidSize: number;
	iexClose: number;
	iexCloseTime: number;
	iexLastUpdated: number;
	iexMarketPercent: number;
	iexOpen: number;
	iexOpenTime: string;
	iexRealtimePrice: number;
	iexRealtimeSize: number;
	iexVolume: number;
	isUSMarketOpen: boolean;
	lastTradeTime: number;
	latestPrice: number;
	latestSource: string;
	latestTime: string;
	latestUpdate: number;
	latestVolume: null | string;
	low: null | string;
	lowSource: string;
	lowTime: number;
	marketCap: number;
	oddLotDelayedPrice: number;
	oddLotDelayedPriceTime: number;
	open: number;
	openSource: string;
	openTime: number;
	peRatio: number;
	previousClose: number;
	previousVolume: number;
	primaryExchange: string;
	symbol: string;
	volume: number;
	week52High: number;
	week52Low: number;
	ytdChange: number;
}
export interface QuotesInterface extends Document {
	symbol: string;
	date: Date;
	data: Quote;
}

const schema: Schema<QuotesInterface> = new Schema({
	symbol: { type: String, required: true },
	date: { type: Date, default: Date.now },
	data: { type: Object },
});

const QuoteModel = dbInstance.createModel<QuotesInterface>('Quote', schema);

export default QuoteModel;
