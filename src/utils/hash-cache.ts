const MINUTES = 60 * 1000;
const HOURS = 60 * MINUTES;
const INTERVAL_AGE = 0.5 * HOURS;

export interface HashData<T> {
	key: string;
	data?: T;
	time: number;
}

export class HashCache<T> {
	private table: HashData<T>[];
	private maxIntervalAge = INTERVAL_AGE;

	constructor(maxIntervalAge = INTERVAL_AGE, hashElements = 541) {
		this.table = new Array(hashElements);
		this.maxIntervalAge = maxIntervalAge;
	}

	getCache(key: string): HashData<T> | null {
		const index = this.hashStringToInt(key);
		const hashTable = this.table;

		if (index in hashTable) {
			if (this.isExpired(hashTable[index].time)) return null;
			const data = hashTable[index];
			if (data.key === key) return data;
			console.log('hash collision');
		}
		return null;
	}

	setCache(key: string, data: T): boolean {
		const index = this.hashStringToInt(key);
		const hashTable = this.table;

		if (index in hashTable) {
			if (this.isExpired(hashTable[index].time)) {
				hashTable[index] = { key, data, time: Date.now() };
				return true;
			}
			return false;
		}
		hashTable[index] = { key, data, time: Date.now() };
		return true;
	}

	hashStringToInt: (str: string) => number = (str) => {
		const hashTable = this.table;
		let hash = 19;
		for (const char of str) {
			hash = (127 * hash + char.charCodeAt(0)) % hashTable.length;
		}
		return hash;
	};

	isExpired(timeStamp: number): boolean {
		if (Date.now() - timeStamp > this.maxIntervalAge) return true;
		return false;
	}
}
