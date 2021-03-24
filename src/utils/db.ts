import mongoose, { Schema, Document } from 'mongoose';
import { connect } from './mongo';

interface CreateModel {
	DBSchema: Schema | null;
	createModel<T extends Document>(
		name: string,
		schema: Schema<T>
	): mongoose.Model<T>;
	getSchema: () => Schema | null;
}

let dbInstance: CreateModel;

function db(): CreateModel {
	connect();

	return {
		DBSchema: null,
		createModel<T extends Document>(
			name: string,
			schema: Schema<T>
		): mongoose.Model<T> {
			this.DBSchema = new Schema(schema);
			return mongoose.model<T>(name, this.DBSchema);
		},
		getSchema(): mongoose.Schema | null {
			return this.DBSchema;
		},
	};
}

try {
	dbInstance = db();
} catch (error) {
	console.error('error connecting to db');
	process.exit(1011);
}

export default dbInstance;
