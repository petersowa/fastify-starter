import { writable } from 'svelte/store';
import { getAccounts, patchPosition } from './handle-ajax';

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
	getAccounts().then((accountData) => {
		set(accountData);
		console.log({ accountData });
	});
});

accountStore.subscribe((data) => console.log({ data }));
accountStore.addPosition = async (newPosition, accountName) => {
	const patchRes = await patchPosition({
		account: accountName,
		position: newPosition,
	});
	console.log({ patchRes });
	console.log(newPosition);
	accountStore.update((storeData) => {
		console.log({ storeData });
		storeData.holdings
			.find((item) => item.name === accountName)
			.positions.push(newPosition);
		return storeData;
	});
};
