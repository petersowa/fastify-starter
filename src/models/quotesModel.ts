import dbInstance from '../utils/db';
import { Schema, Document } from 'mongoose';

export interface QuotesInterface extends Document {
	symbol: string;
	date: string;
	data: {};
}

const schema: Schema = new Schema({
	symbol: { type: String, required: true },
	date: { type: Date, default: Date.now },
	data: { type: Object },
});

const QuoteModel = dbInstance.createModel<QuotesInterface>('Quote', schema);

export default QuoteModel;
