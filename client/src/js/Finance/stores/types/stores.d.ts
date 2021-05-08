export interface Position {
	_id: string;
	quantity: number;
	cost: number;
	symbol: string;
}

export interface Holding {
	_id: string;
	name: string;
	positions: Position[];
}

export interface Holdings {
	holdings: Holding[];
}
