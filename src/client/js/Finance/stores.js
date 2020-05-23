import { writable } from 'svelte/store';

export const watchList = writable([]);
export const accounts = writable([
	{ name: 'main account' },
	{ name: 'joint account' },
	{ name: 'private account' },
]);
