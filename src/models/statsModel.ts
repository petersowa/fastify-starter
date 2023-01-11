import dbInstance from '../utils/db';
import { Schema, Document, Types } from 'mongoose';
import { RapidStatsResult } from '../api/types';

export interface StatsInterface extends Document {
	symbol: string;
	date: Date;
	data: RapidStatsResult;
}

const schema: Schema<StatsInterface> = new Schema({
	symbol: { type: String, required: true },
	date: { type: Date, default: Date.now },
	data: { type: Object },
});

const StatsModel = dbInstance.createModel<StatsInterface>('Stats', schema);

export default StatsModel;
