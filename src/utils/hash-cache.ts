const MINUTES = 60 * 1000;
const HOURS = 60 * MINUTES;
const QUOTE_AGE = 0.5 * HOURS;

export interface StockData {
	[key: string]: string;
}

export interface HashTable<T> {
	key: string;
	data?: T;
	time: number;
}
const hashTable: HashTable<StockData>[] = new Array(541);

const ageStamp = (interval: number = QUOTE_AGE): number => {
	return Math.floor(Date.now() / interval);
};

const isExpired = (
	timeStamp: number,
	interval: number = QUOTE_AGE
): boolean => {
	if (Date.now() - timeStamp > interval) return true;
	return false;
};

const hashStringToInt: (str: string) => number = (str) => {
	let hash = 19;
	for (const char of str) {
		hash = (127 * hash + char.charCodeAt(0)) % hashTable.length;
	}
	return hash;
};

function getCache(key: string): HashTable<{}> | null {
	const index = hashStringToInt(key);

	if (index in hashTable) {
		if (isExpired(hashTable[index].time)) return null;
		const data = hashTable[index];
		if (data.key === key) return data;
		console.log('hash collision');
	}
	return null;
}

function setCache(key: string, data: {}): boolean {
	const index = hashStringToInt(key);
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

export { getCache, setCache };
