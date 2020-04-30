import dbInstance from '../utils/db';
import { Schema, Document } from 'mongoose';

interface QuotesModel extends Document {
	symbol: string;
	date: string;
	data: {};
}

const schema: Schema = new Schema({
	symbol: String,
	date: { type: Date, default: Date.now },
	data: { type: Object },
});

const QuoteModel = dbInstance.createModel<QuotesModel>('Quote', schema);

export default QuoteModel;
