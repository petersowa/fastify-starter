import mongoose, { Schema } from 'mongoose';
import { connect } from './mongo';

interface CreateModel {
	DBSchema: Schema | null;
	createModel<T>(name: string, schema: Schema<T>): mongoose.Model<T>;
	getSchema<T>(): Schema<T> | null;
}

let dbInstance: CreateModel;

function db(): CreateModel {
	connect();

	return {
		DBSchema: null,
		createModel<T>(name: string, schema: Schema<T>): mongoose.Model<T> {
			this.DBSchema = schema;
			return mongoose.model<T>(name, this.DBSchema);
		},
		getSchema<T>(): mongoose.Schema<T> | null {
			return this.DBSchema;
		},
	};
}

try {
	console.log('...getting dbinstance');
	dbInstance = db();
} catch (error) {
	console.error('error connecting to db');
	process.exit(1011);
}

export default dbInstance;
