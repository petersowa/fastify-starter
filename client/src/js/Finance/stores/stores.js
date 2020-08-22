import { writable } from 'svelte/store';
import { quotesStore } from '../stores/QuotesStore';
import {
	getAccounts,
	addPosition,
	deletePosition,
	updatePosition,
	addHoldingsAccount,
	deleteHoldingsAccount,
} from '../handle-ajax';

function setSpinner() {
	let isLoaded = false;
	let isMinWait = false;
	appStore.update((v) => ({ isLoaded, isMinWait, count: v.count + 1 }));

	setTimeout(() => {
		isMinWait = true;
		appStore.update((v) => ({ ...v, isMinWait }));
	}, 1000);
	return () => {
		appStore.update((v) => ({
			...v,
			isLoaded: v.count === 1 ? true : false,
			count: v.count - 1 || 0,
		}));
	};
}

const appStore = writable({
	isMinWait: true,
	isLoaded: true,
	count: 0,
});

const accountStore = writable([], (set) => {
	getAccounts()
		.then((accountData) => {
			if (accountData) {
				set(accountData);
			} else {
				set({});
				console.error({ error: 'no account holdings data found' });
			}
		})
		.catch((err) => {
			console.error({ error: err.message });
		});
});

accountStore.subscribe((data) => console.log({ data }));

accountStore.addHoldingsAccount = async (accountName) => {
	try {
		const patchRes = await addHoldingsAccount({
			holdingsName: accountName,
		});

		console.log({ accountName, patchRes });
		if (patchRes.status == 200) {
			accountStore.update((storeData) => {
				storeData.holdings.push(patchRes.data.data);

				return storeData;
			});
		}
	} catch (err) {
		console.error({ err });
	}
};

accountStore.deleteHoldingsAccount = async (holdingsId) => {
	try {
		const patchRes = await deleteHoldingsAccount({
			holdingsId,
		});

		console.log({ holdingsId, patchRes });
		if (patchRes.status == 200) {
			accountStore.update((storeData) => {
				return {
					...storeData,
					holdings: storeData.holdings.filter(
						(holding) => holding._id !== holdingsId
					),
				};
			});
		}
	} catch (err) {
		console.error({ err });
	}
};

accountStore.addPosition = async (newPosition, holdingsId) => {
	try {
		const patchRes = await addPosition({
			holdingsId,
			position: newPosition,
		});

		accountStore.update((storeData) => {
			if (!storeData.holdings) {
				getAccounts().then((accounts) => {
					accountStore.update(() => accounts);
				});
			} else {
				storeData.holdings
					.find((item) => item._id == holdingsId)
					.positions.push(patchRes.data.newPosition);
				return storeData;
			}
		});
	} catch (err) {
		console.error({ err });
	}
};

accountStore.deletePosition = async (positionId, holdingId) => {
	const res = await deletePosition({
		positionId,
		holdingId,
	});
	if (res.data && res.data.positionId) {
		accountStore.update((storeData) => {
			const holding = storeData.holdings.find(
				(holding) => holding._id === holdingId
			);
			const positions = holding.positions.filter(
				(position) => position._id !== positionId
			);
			holding.positions = positions;
			return storeData;
		});
	} else {
		console.log({ res });
	}
};
accountStore.updatePosition = async (position, holdingId) => {
	const res = await updatePosition({
		position,
		holdingId,
	});

	if (res.data.id) {
		accountStore.update((storeData) => {
			const holding = storeData.holdings.find(
				(holding) => holding._id === holdingId
			);

			holding.positions.every((e, i, positions) => {
				if (e._id == position._id) {
					console.log('found');
					positions[i] = position;
					return false;
				}
				return true;
			});

			return storeData;
		});
	} else {
		console.error({ res });
	}
};

const stockStore = writable({});

accountStore.subscribe(async (accountList) => {
	const stockQuotes = {};
	const quotes = {};

	if (
		accountList &&
		accountList.holdings &&
		accountList.holdings.length > 0
	) {
		const clearSpinner = setSpinner();
		try {
			accountList.holdings.forEach((holding) => {
				holding.positions.forEach(async (position) => {
					if (position.symbol in quotes) return;
					quotes[position.symbol] = await quotesStore.getQuote(
						position.symbol
					);
				});
			});

			const res = await Promise.all(Object.values(quotes));
			res.forEach((quote) => (stockQuotes[quote.symbol] = quote));
			console.log('checking holdings', res);
			console.log({ stockQuotes });

			clearSpinner();
		} catch (err) {
			console.error(err);
			clearSpinner();
		}
	}

	stockStore.update(() => {
		return stockQuotes;
	});
});

export { stockStore, accountStore, appStore, setSpinner };
