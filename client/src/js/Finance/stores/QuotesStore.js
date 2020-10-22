import { writable } from 'svelte/store';
import { getQuote } from '../handle-ajax';
import { __qq } from '../../utils/qq';

const quotesStore = writable({ symbols: [], quote: {} });
const MAX_AGE = 1000 * 60 * 5;
const quotesDataCache = new Map();

const fetchQuote = async (symbol) => {
	let quote;
	const cachedQuote = quotesDataCache.get(symbol);
	__qq.log({ cachedQuote });
	if (!cachedQuote || Date.now() - cachedQuote.__age > MAX_AGE) {
		quote = await getQuote(symbol);
	}
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
	} else {
		__qq.log('CACHED QUOTE');
	}
	return quote || cachedQuote;
};

quotesStore.addPosition = async (symbol) => {
	if (quotesDataCache.get(symbol)) return;

	await fetchQuote(symbol);
};

quotesStore.refresh = () => {
	for (const symbol in quotesDataCache) {
		fetchQuote(symbol);
	}
};

quotesStore.getQuote = async (symbol) => {
	const quote = await fetchQuote(symbol);
	return quote;
};

export { quotesStore };
