import dbInstance from '../utils/db';
import { Schema, Document } from 'mongoose';

interface WatchlistModel extends Document {
	date: string;
	user: {};
	symbols: string[];
}

const schema: Schema = new Schema({
	updated: { type: Date, default: Date.now },
	user: { type: Schema.Types.ObjectId, ref: 'Users' },
	symbols: [String],
});

const WatchlistModel = dbInstance.createModel<WatchlistModel>(
	'Watchlist',
	schema
);
export default WatchlistModel;
