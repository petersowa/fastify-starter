import { writable } from 'svelte/store';
import { getQuote } from '../handle-ajax';

const quotesStore = writable({ symbols: [], quote: {} });
const MAX_AGE = 1000 * 60 * 5;
const cache = {};

const getStoreQuote = (symbol) => {
	let quote;
	if (cache.quotesData) {
		quote = cache.quotesData.quote[symbol];
		console.log('CACHED QUOTE', quote);
	}
	return quote;
};

const fetchQuote = async (symbol) => {
	//check for stored quote
	let quote;
	const storeQuote = getStoreQuote(symbol);
	console.log({ storeQuote });
	if (!storeQuote || Date.now() - storeQuote.__age > MAX_AGE) {
		// console.log('getting quote for ', symbol);
		quote = await getQuote(symbol);
	}
	if (quote) {
		quotesStore.update((quotesData) => {
			if (!quotesData.quote[symbol]) {
				quotesData.symbols.push(symbol);
			}
			// console.log('store quote data', quotesData);
			quotesData.quote[symbol] = { ...quote, __age: Date.now() };
			return quotesData;
		});
	}
	return quote || storeQuote;
};

quotesStore.subscribe((quotesData) => {
	cache.quotesData = quotesData;
	// console.log('...quotesStore updated', quotesData);
});

quotesStore.addPosition = async (symbol) => {
	if (cache.quotesStore && cache.quotesStore.quote[symbol]) return;

	await fetchQuote(symbol);
};

quotesStore.refresh = () => {
	if (cache.quotesStore) {
		cache.quotesStore.symbols.forEach(async (symbol) => {
			await fetchQuote(symbol);
		});
	}
};

quotesStore.getQuote = async (symbol) => {
	const quote = await fetchQuote(symbol);
	return quote;
};

export { quotesStore };
