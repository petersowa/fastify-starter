import { writable } from 'svelte/store';
import {
	getAccounts,
	addPosition,
	deletePosition,
	updatePosition,
	addHoldingsAccount,
} from './handle-ajax';

export function setSpinner() {
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

export const appStore = writable({
	isMinWait: true,
	isLoaded: true,
	count: 0,
});

export const watchList = writable([]);

export const accountStore = writable([], (set) => {
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
		accountStore.update((storeData) => {
			console.log(storeData.holdings);
			const alreadyExists = storeData.holdings.find(
				(holding) => accountName == holding.name
			);
			storeData.holdings.push({
				alreadyExists,
				name: accountName,
				_id: 1,
				positions: [],
			});

			return storeData;
		});
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
					.positions.push(patchRes.newPosition);
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
	if (res && res.positionId) {
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

	if (res.id) {
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
