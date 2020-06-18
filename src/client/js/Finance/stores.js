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
	set(accountData);
});

getAccounts();

const accountData = [
	{
		name: 'main account',
		positions: [
			{
				symbol: 'IBM',
				date: '12/3/2005',
				quantity: 12,
				cost: 3000,
				gain: 0.1,
				dollarGain: 100,
			},
		],
	},
	{
		name: 'joint account',
		positions: [
			{
				symbol: 'IBM',
				date: '12/3/2005',
				quantity: 12,
				cost: 3000,
				gain: 0.1,
				dollarGain: 100,
			},
			{
				symbol: 'ATVI',
				date: '7/3/2015',
				quantity: 12,
				cost: 3000,
				gain: 0.1,
				dollarGain: 100,
			},
		],
	},
	{
		name: 'private account',
		positions: [
			{
				symbol: 'AMZN',
				date: '12/3/2005',
				quantity: 12,
				cost: 3000,
				gain: 0.1,
				dollarGain: 100,
			},
		],
	},
];

accountStore.subscribe((data) => console.log({ data }));
accountStore.addPosition = async (newPosition, accountName) => {
	const patchRes = await patchPosition({
		account: accountName,
		position: newPosition,
	});
	console.log({ patchRes });
	console.log(newPosition);
	accountStore.update((storeData) => {
		storeData
			.find((item) => item.name === accountName)
			.positions.push(newPosition);
		return storeData;
	});
};
