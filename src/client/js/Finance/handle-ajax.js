const WATCHLIST_ROUTE = '/stocks/watchlist';
const ACCOUNT_ROUTE = '/stocks/account';
const QUOTE_ROUTE = '/stocks/quote';
const POST = 'POST';
const PATCH = 'PATCH';
const DELETE = 'DELETE';
const PUT = 'PUT';

async function postWatchlist(list) {
	return secureFetch(WATCHLIST_ROUTE, POST, {
		watchList: list,
	});
}

async function getQuote(symbol) {
	return await getFetch(`${QUOTE_ROUTE}/${symbol}`);
}

async function getWatchlist() {
	return await getFetch(WATCHLIST_ROUTE);
}

async function getAccounts() {
	return getFetch(ACCOUNT_ROUTE);
}

export async function addPosition({ account, position }) {
	return secureFetch(ACCOUNT_ROUTE, PUT, {
		account,
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
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
				'csrf-token': getTokenCSRF(),
			},
			body: JSON.stringify(body),
		});
		return res.json();
	} catch (err) {
		console.log({ ajaxERROR: err.message });
		return { error: err.message };
	}
}

async function getFetch(route) {
	try {
		const res = await fetch(route);
		return res.json();
	} catch (err) {
		console.log({ ajaxERROR: err.message });
		return { error: err.message };
	}
}

export { postWatchlist, getQuote, getWatchlist, getAccounts };
