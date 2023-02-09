import { Document } from 'mongoose';

export interface Interface<T> extends Document {
	symbol: string;
	date: Date;
	data: T;
}
