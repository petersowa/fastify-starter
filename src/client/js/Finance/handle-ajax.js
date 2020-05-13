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

export { postWatchlist };
