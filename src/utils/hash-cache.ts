import chalk from 'chalk';

const MINUTES = 60 * 1000;
const HOURS = 60 * MINUTES;
const INTERVAL_AGE = 0.5 * HOURS;

export interface HashData<T> {
	key: string;
	data?: T;
	time: number;
}

export class HashCache<T> {
	private table: Map<number, HashData<T> | HashData<T>[]>;
	private maxIntervalAge: number;
	private maxElements: number;

	constructor(maxIntervalAge = INTERVAL_AGE, hashElements = 541) {
		this.table = new Map();
		this.maxIntervalAge = maxIntervalAge;
		this.maxElements = hashElements;
	}

	getCache(key: string): HashData<T> | null {
		const index = this.hashStringToInt(key);
		const hashTable = this.table;

		const cached = hashTable.get(index);

		if (!cached) return null;

		if (!(cached instanceof Array)) {
			if (this.isExpired(cached.time)) return null;
			if (cached.key === key) return cached;
		} else {
			const item = cached.find((item) => item.key === key);
			if (item) {
				if (this.isExpired(item.time)) return null;
				return item;
			}
			return null;
		}

		return null;
	}

	setCache(key: string, data: T): boolean {
		const index = this.hashStringToInt(key);
		const hashTable = this.table;
		const cacheData = { key, data, time: Date.now() };

		let cached = hashTable.get(index);

		if (cached) {
			if (cached instanceof Array) {
				cached = cached.filter((item) => !this.isExpired(item.time));
				if (cached.length === 0) {
					hashTable.set(index, cacheData);
				} else {
					hashTable.set(index, [...cached, cacheData]);
				}
			} else {
				if (this.isExpired(cached.time)) {
					hashTable.set(index, cacheData);
				} else {
					hashTable.set(index, [cached, cacheData]);
				}
			}
		} else {
			hashTable.set(index, { key, data, time: Date.now() });
		}
		return true;
	}

	list(): void {
		// console.log('listing elements', this.table);
		this.table.forEach((cached, i) => {
			if (cached instanceof Array) {
				console.log(
					i,
					chalk.blue(cached.map((item) => item.key).join(','))
				);
			} else {
				console.log(i, chalk.blue(cached.key));
			}
		});
	}

	hashStringToInt: (str: string) => number = (str) => {
		let hash = 19;
		for (const char of str) {
			hash = (127 * (hash + char.charCodeAt(0))) % this.maxElements;
		}
		return hash;
	};

	isExpired(timeStamp: number): boolean {
		return Date.now() - timeStamp > this.maxIntervalAge;
	}
}
