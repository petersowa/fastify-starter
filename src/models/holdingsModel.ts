import dbInstance from '../utils/db';
import { Schema, Document, Types } from 'mongoose';

export interface HoldingInterface extends Document {
	date: Date;
	purchaseDate: Date;
	symbol: string;
	type: string;
	quantity: number;
	cost: number;
	fees: number;
	purchasePrice: number;
	adjustment: number;
	dividend: number;
}

export interface HoldingsInterface extends Document {
	updated: Date;
	holdings: HoldingInterface[];
}

const holding: Schema = new Schema({
	date: { type: Date, default: Date.now },
	purchaseDate: { type: Date, required: true },
	symbol: String,
	type: String,
	quantity: Number,
	cost: Number,
	fees: Number,
	purchasePrice: Number,
	adjustment: { type: Number, default: 1 },
	dividend: Number,
});

const holdings: Schema = new Schema({
	updated: { type: Date, default: Date.now },
	holdings: [holding],
	// holdings: { type: Schema.Types.ObjectId, ref: 'Holding', unique: true },
});

const HoldingModel = dbInstance.createModel<HoldingInterface>(
	'Holding',
	holding
);

const HoldingsModel = dbInstance.createModel<HoldingsInterface>(
	'Holdings',
	holdings
);
export { HoldingsModel, HoldingModel };
