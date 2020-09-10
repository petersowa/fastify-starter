const MINUTES = 60 * 1000;
const HOURS = 60 * MINUTES;
const QUOTE_AGE = 0.5 * HOURS;

export interface HashData<T> {
	key: string;
	data?: T;
	time: number;
}

export class HashCache<T> {
	private table: HashData<T>[];

	constructor() {
		this.table = new Array(541);
	}

	getCache(key: string): HashData<T> | null {
		const index = this.hashStringToInt(key);
		const hashTable = this.table;

		if (index in hashTable) {
			if (isExpired(hashTable[index].time)) return null;
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
			if (isExpired(hashTable[index].time)) {
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
}

const isExpired = (
	timeStamp: number,
	interval: number = QUOTE_AGE
): boolean => {
	if (Date.now() - timeStamp > interval) return true;
	return false;
};
