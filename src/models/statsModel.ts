import dbInstance from '../utils/db';
import { Schema } from 'mongoose';
import { RapidStatsResult } from '../api/types';
import type { Interface } from './model-types';

const schema: Schema<Interface<RapidStatsResult>> = new Schema({
	symbol: { type: String, required: true },
	date: { type: Date, default: Date.now },
	data: { type: Object },
});

const StatsModel = dbInstance.createModel<Interface<RapidStatsResult>>(
	'Stats',
	schema
);

export default StatsModel;
