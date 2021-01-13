import dbInstance from '../utils/db';
import { Schema, Document, Types } from 'mongoose';

export interface WatchlistInterface extends Document {
	updated: Date;
	user: Types.ObjectId;
	symbols: Types.Array<string>;
}

const schema: Schema<WatchlistInterface> = new Schema({
	updated: { type: Date, default: Date.now },
	user: { type: Schema.Types.ObjectId, ref: 'Users', unique: true },
	symbols: [String],
});

const WatchlistModel = dbInstance.createModel<WatchlistInterface>(
	'Watchlist',
	schema
);
export default WatchlistModel;
