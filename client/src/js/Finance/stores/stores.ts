import { writable, Writable } from 'svelte/store';
import { getQuote } from './QuotesStore';
import {
	getAccounts,
	addPosition,
	deletePosition,
	updatePosition,
	addHoldingsAccount,
	deleteHoldingsAccount,
} from '../handle-ajax';

import type { Position, Holdings, Holding } from './types/stores';

const appStore = writable({
	isMinWait: true,
	isLoaded: true,
	count: 0,
});

function setSpinner(): () => void {
	const isLoaded = false;
	let isMinWait = false;
	appStore.update((v) => ({ isLoaded, isMinWait, count: v.count + 1 }));

	setTimeout(() => {
		isMinWait = true;
		appStore.update((v) => ({ ...v, isMinWait }));
	}, 200);
	return () => {
		appStore.update((v) => ({
			...v,
			isLoaded: v.count === 1 ? true : false,
			count: v.count - 1 || 0,
		}));
	};
}

interface AccountStore {
	addHoldingsAccount: (accountName: string) => Promise<void>;
	deleteHoldingsAccount: (holdingsId: string) => Promise<void>;
	addPosition: (newPosition: Position, holdingsId: string) => Promise<void>;
	deletePosition: (positionId: string, holdingsId: string) => Promise<void>;
	updatePosition: (
		NewPosition: Position,
		holdingsId: string
	) => Promise<void>;
	data: Writable<Holdings>;
}

const accountStore: AccountStore = {
	data: writable({} as Holdings, (set) => {
		getAccounts()
			.then((accountData) => {
				if (accountData) {
					set(accountData);
				} else {
					set({} as Holdings);
					console.error({ error: 'no account holdings data found' });
				}
			})
			.catch((err) => {
				console.error({ error: err.message });
			});
	}),
	addHoldingsAccount: async (accountName) => {
		try {
			const patchRes = await addHoldingsAccount({
				holdingsName: accountName,
			});

			console.log({ accountName, patchRes });
			if (patchRes.status == 200) {
				accountStore.data.update((storeData) => {
					if (!storeData.holdings)
						storeData.holdings = [] as Holding[];
					storeData.holdings.push(patchRes.data.data);

					return storeData;
				});
			}
		} catch (err) {
			console.error({ err });
		}
	},
	deleteHoldingsAccount: async (holdingsId: string) => {
		try {
			const patchRes = await deleteHoldingsAccount({
				holdingsId,
			});

			console.log({ holdingsId, patchRes });
			if (patchRes.status == 200) {
				accountStore.data.update((storeData) => {
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
	},
	addPosition: async (newPosition, holdingsId) => {
		try {
			const patchRes = await addPosition({
				holdingsId,
				position: newPosition,
			});

			accountStore.data.update((storeData) => {
				if (!storeData.holdings) {
					getAccounts().then((accounts) => {
						accountStore.data.update(() => accounts);
					});
				} else {
					storeData.holdings
						.find((holding) => holding._id == holdingsId)
						.positions.push(patchRes.data.newPosition);
					return storeData;
				}
			});
		} catch (err) {
			console.error({ err });
		}
	},
	deletePosition: async (positionId, holdingId) => {
		const res = await deletePosition({
			positionId,
			holdingId,
		});
		if (res.data && res.data.positionId) {
			accountStore.data.update((storeData) => {
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
	},
	updatePosition: async (position, holdingId) => {
		const res = await updatePosition({
			position,
			holdingId,
		});

		if (res.data.id) {
			accountStore.data.update((storeData) => {
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
	},
};

accountStore.data.subscribe((data) => console.log({ data }));

const stockStore = writable({});

accountStore.data.subscribe(async (accountList) => {
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
					quotes[position.symbol] = await getQuote(position.symbol);
				});
			});

			const res = await Promise.all(Object.values(quotes));
			res.forEach(
				(quote: { symbol: string }) =>
					(stockQuotes[quote.symbol] = quote)
			);
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
