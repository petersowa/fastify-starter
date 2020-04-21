import dbInstance from '../utils/db';
import { Schema, Document } from 'mongoose';

interface WebStatsModel extends Document {
	ip: string;
	header: string;
	count: number;
}

const schema: Schema = new Schema({
	ip: { type: String, required: true, unique: true },
	header: { type: String, required: true },
	count: { type: Number, default: 0 },
});

const WebStatsModel = dbInstance.createModel<WebStatsModel>('WebStats', schema);

export { WebStatsModel };
