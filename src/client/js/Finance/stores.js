import { writable } from 'svelte/store';

export const watchList = writable([]);
export const accounts = writable([
	{
		name: 'main account',
		positions: [
			{
				symbol: 'ibm',
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
				symbol: 'ibm',
				date: '12/3/2005',
				quantity: 12,
				cost: 3000,
				gain: 0.1,
				dollarGain: 100,
			},
			{
				symbol: 'atvi',
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
				symbol: 'ibm',
				date: '12/3/2005',
				quantity: 12,
				cost: 3000,
				gain: 0.1,
				dollarGain: 100,
			},
		],
	},
]);
