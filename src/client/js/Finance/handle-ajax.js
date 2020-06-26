const WATCHLIST_ROUTE = '/stocks/watchlist';
const ACCOUNT_ROUTE = '/stocks/account';
const QUOTE_ROUTE = '/stocks/quote';
const POST = 'POST';
const PATCH = 'PATCH';
const DELETE = 'DELETE';
const GET = 'GET';

function getTokenCSRF() {
	return document
		.querySelector('meta[name="csrf-token"]')
		.getAttribute('content');
}

function secureFetch(route, method, body) {
	return fetch(route, {
		method,
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
			'csrf-token': getTokenCSRF(),
		},
		body: JSON.stringify(body),
	});
}

async function postWatchlist(list) {
	console.log('POSTWATCHLIST');
	try {
		const response = await secureFetch(WATCHLIST_ROUTE, POST, {
			watchList: list,
		});
		const data = await response.json();
		console.log('SUCCESS::POSTWATCHLIST', data);
		return data;
	} catch (err) {
		console.log({ watchlist: err });
	}
}

async function getQuote(symbol) {
	let data = null;
	try {
		const res = await fetch(`${QUOTE_ROUTE}/${symbol}`);
		data = await res.json();
	} catch (err) {
		console.error('unable to fetch or parse', { err });
	}
	return data;
}

async function getWatchlist() {
	const res = await fetch(WATCHLIST_ROUTE);
	return res.json();
}

async function getAccounts() {
	const res = await fetch(ACCOUNT_ROUTE);
	return await res.json();
}

async function patchPosition({ account, position }) {
	try {
		const response = await secureFetch(ACCOUNT_ROUTE, PATCH, {
			account,
			position,
		});

		const data = await response.json();
		return data;
	} catch (err) {
		console.log({ accountPatch: err });
	}
}

export async function deletePosition({ holdingId, positionId }) {
	try {
		const response = await secureFetch(ACCOUNT_ROUTE, DELETE, {
			holdingId,
			positionId,
		});

		const data = await response.json();
		return data;
	} catch (err) {
		console.log({ deletePosition: err });
	}
}

export { postWatchlist, getQuote, getWatchlist, getAccounts, patchPosition };
