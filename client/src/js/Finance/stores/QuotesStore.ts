import { writable } from 'svelte/store';
import { getQuote as fetchQuote } from '../handle-ajax';
import __qq from '../../utils/qq';

const quotesStore = writable({ symbols: [], quote: {} });
const MAX_AGE = 1000 * 60 * 5;
const quotesDataCache = new Map();

const checkQuote = async (symbol) => {
	const cachedQuote = quotesDataCache.get(symbol);

	if (cachedQuote && Date.now() - cachedQuote.__age < MAX_AGE) {
		__qq.log('CACHED: ', { cachedQuote });
		return cachedQuote;
	}

	try {
		let quote = await fetchQuote(symbol);

		if (quote) {
			__qq.log('FRESH QUOTE');
			quotesStore.update((quotesData) => {
				if (!quotesData.quote[symbol]) {
					quotesData.symbols.push(symbol);
				}
				quotesData.quote[symbol] = { ...quote, __age: Date.now() };
				quotesDataCache.set(symbol, quotesData.quote[symbol]);
				return quotesData;
			});
			return quote;
		}
	} catch (err) {
		__qq.error('ERROR FETCHING QUOTE', { err });
	}

	throw new Error('Unable to access quote data');
};

const addPosition = async (symbol) => {
	if (quotesDataCache.get(symbol)) return null;

	await checkQuote(symbol);
};

const refresh = () => {
	for (const symbol in quotesDataCache) {
		checkQuote(symbol);
	}
};

const getQuote = async (symbol) => await checkQuote(symbol);

export { quotesStore, addPosition, refresh, getQuote };
