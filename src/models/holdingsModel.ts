import dbInstance from '../utils/db';
import { Schema, Document, Types } from 'mongoose';

export interface PositionInterface extends Document {
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
	name: string;
	positions: Types.Array<PositionInterface>;
}

const position: Schema<PositionInterface> = new Schema({
	date: { type: Date, default: Date.now },
	purchaseDate: { type: Date, required: true },
	symbol: String,
	type: { type: String, required: false },
	quantity: Number,
	cost: Number,
	fees: Number,
	purchasePrice: Number,
	adjustment: { type: Number, default: 1 },
	dividend: Number,
});

const holdings: Schema<HoldingsInterface> = new Schema({
	updated: { type: Date, default: Date.now },
	name: { type: String, default: 'alpha' },
	positions: [position],
	// holdings: { type: Schema.Types.ObjectId, ref: 'Holding', unique: true },
});

const PositionModel = dbInstance.createModel<PositionInterface>(
	'Position',
	position
);

const HoldingsModel = dbInstance.createModel<HoldingsInterface>(
	'Holdings',
	holdings
);
export { HoldingsModel, PositionModel };
