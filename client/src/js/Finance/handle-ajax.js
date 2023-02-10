const HOST = 'http://localhost:3999';

const WATCHLIST_ROUTE = HOST + '/stocks/watchlist';
const ACCOUNT_ROUTE = HOST + '/stocks/account';
const QUOTE_ROUTE = HOST + '/stocks/quote';
const STATS_ROUTE = HOST + '/stocks/stats';
const HOLDINGS_ROUTE = HOST + '/stocks/holdings';
const POST = HOST + 'POST';
const PATCH = HOST + 'PATCH';
const DELETE = HOST + 'DELETE';
const PUT = HOST + 'PUT';

async function postWatchlist(list) {
	return secureFetch(WATCHLIST_ROUTE, POST, {
		watchList: list,
	});
}

async function addHoldingsAccount({ holdingsName }) {
	return secureFetch(HOLDINGS_ROUTE, POST, { holdingsName });
}

async function deleteHoldingsAccount({ holdingsId }) {
	return secureFetch(HOLDINGS_ROUTE, DELETE, { holdingsId });
}

async function getQuote(symbol) {
	return await getFetch(`${QUOTE_ROUTE}/${symbol}`);
}

async function getStats(symbol) {
	console.log('getting stats...');
	return await getFetch(`${STATS_ROUTE}/${symbol}`);
}

async function getWatchlist() {
	return await getFetch(WATCHLIST_ROUTE);
}

async function getAccounts() {
	return getFetch(ACCOUNT_ROUTE);
}

export async function addPosition({ holdingsId, position }) {
	return secureFetch(ACCOUNT_ROUTE, PUT, {
		holdingsId,
		position,
	});
}

export async function deletePosition({ holdingId, positionId }) {
	return secureFetch(ACCOUNT_ROUTE, DELETE, {
		holdingId,
		positionId,
	});
}

export async function updatePosition({ position, holdingId }) {
	return secureFetch(ACCOUNT_ROUTE, PATCH, {
		position,
		holdingId,
	});
}

function getTokenCSRF() {
	return document
		.querySelector('meta[name="csrf-token"]')
		.getAttribute('content');
}

async function secureFetch(route, method, body) {
	try {
		const res = await fetch(route, {
			method,
			// credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'csrf-token': getTokenCSRF(),
			},
			body: JSON.stringify(body),
		});
		console.log({ res });
		const data = await res.json();
		return {
			data,
			status: res.status,
			ok: res.ok,
			url: res.url,
			redirected: res.redirected,
		};
	} catch (err) {
		console.log({ ajaxERROR: err.message });
		return { error: err.message };
	}
}

async function getFetch(route) {
	try {
		const res = await fetch(route, {
			credentials: 'include',
			headers: {},
		});
		return res.json();
	} catch (err) {
		console.log({ ajaxERROR: err.message });
		return { error: err.message };
	}
}

export {
	postWatchlist,
	getQuote,
	getStats,
	getWatchlist,
	getAccounts,
	addHoldingsAccount,
	deleteHoldingsAccount,
};
