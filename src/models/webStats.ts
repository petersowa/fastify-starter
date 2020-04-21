import dbInstance from '../utils/db';
import { Schema, Document } from 'mongoose';

interface WebStatsModel extends Document {
	ip: string;
	header: string;
	userAgent: string;
	count: number;
}

const schema: Schema = new Schema({
	ip: { type: String, required: true, unique: true },
	header: { type: String },
	userAgent: { type: String },
	count: { type: Number, default: 0 },
});

const WebStatsModel = dbInstance.createModel<WebStatsModel>('WebStats', schema);

export { WebStatsModel };
