import { writable } from 'svelte/store';
import {
	getAccounts,
	addPosition,
	deletePosition,
	updatePosition,
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
			console.log({ accountData });
		})
		.catch((err) => {
			console.error({ error: err.message });
		});
});

accountStore.subscribe((data) => console.log({ data }));
accountStore.addPosition = async (newPosition, accountName) => {
	const patchRes = await addPosition({
		account: accountName,
		position: newPosition,
	});
	console.log({ patchRes });
	console.log(newPosition);
	accountStore.update((storeData) => {
		console.log({ storeData });
		if (!storeData.holdings) {
			getAccounts().then((accounts) => {
				accountStore.update(() => accounts);
			});
		} else {
			storeData.holdings
				.find((item) => item.name === accountName)
				.positions.push(patchRes.newPosition);
			return storeData;
		}
	});
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
			console.log({ storeData });
			return storeData;
		});
		console.log('delete position', { res });
	} else {
		console.log({ res });
	}
};
accountStore.updatePosition = async (position, holdingId) => {
	const res = await updatePosition({
		position,
		holdingId,
	});
};
