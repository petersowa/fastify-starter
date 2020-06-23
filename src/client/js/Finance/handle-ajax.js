async function postWatchlist(list) {
	const csrf = document
		.querySelector('meta[name="csrf-token"]')
		.getAttribute('content');
	console.log('POSTWATCHLIST');
	try {
		const response = await fetch(`/stocks/watchlist`, {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
				'csrf-token': csrf,
			},
			body: JSON.stringify({
				watchList: list,
			}),
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
		const res = await fetch(`/stocks/quote/${symbol}`);
		data = await res.json();
	} catch (err) {
		console.error('unable to fetch or parse', { err });
	}
	return data;
}

async function getWatchlist() {
	const res = await fetch(`/stocks/watchlist`);
	console.log({ watchlist: res });
	return res.json();
}

async function getAccounts() {
	console.log('GETTING ACCOUNTS');
	const res = await fetch(`/stocks/accounts`);
	const data = await res.json();
	console.log({ accountData: data });
}

async function patchPosition({ account, position }) {
	const csrf = document
		.querySelector('meta[name="csrf-token"]')
		.getAttribute('content');
	try {
		const response = await fetch(`/stocks/account`, {
			method: 'PATCH',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
				'csrf-token': csrf,
			},
			body: JSON.stringify({
				account,
				position,
			}),
		});
		const data = await response.json();
		return data;
	} catch (err) {
		console.log({ accountPatch: err });
	}
}

export { postWatchlist, getQuote, getWatchlist, getAccounts, patchPosition };
