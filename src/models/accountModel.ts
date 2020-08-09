import dbInstance from '../utils/db';
import { Schema, Document, Types } from 'mongoose';
import { HoldingsModel, HoldingsInterface } from './holdingsModel';

export interface AccountInterface extends Document {
	updated: Date;
	user: Types.ObjectId;
	secondaryUser?: Types.ObjectId;
	holdings: Types.DocumentArray<HoldingsInterface>;
	transactions: Types.ObjectId;
}

const account: Schema = new Schema({
	updated: { type: Date, default: Date.now },
	user: {
		type: Schema.Types.ObjectId,
		ref: 'Users',
		unique: true,
		required: true,
	},
	secondaryUser: { type: Schema.Types.ObjectId, ref: 'Users' },
	holdings: [{ type: Schema.Types.ObjectId, ref: 'Holdings', unique: true }],
	transactions: {
		type: Schema.Types.ObjectId,
		ref: 'Transactions',
		// unique: true,
	},
});

const AccountModel = dbInstance.createModel<AccountInterface>(
	'Accounts',
	account
);
export default AccountModel;
