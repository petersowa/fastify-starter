import mongoose, { SchemaDefinition, Document, Schema } from 'mongoose';
import { connect } from './mongo';

interface CreateModel {
	DBSchema: Schema | null;
	createModel<T>(
		name: string,
		schema: SchemaDefinition
	): mongoose.Model<Document & T>;
	getSchema: () => Schema | null;
}

let dbInstance: CreateModel;

function db(): CreateModel {
	connect();

	return {
		DBSchema: null,
		createModel<T>(name: string, schema: SchemaDefinition): mongoose.Model<Document & T> {
			this.DBSchema = new mongoose.Schema(schema);
			return mongoose.model<Document & T>(name, this.DBSchema);
		},
		getSchema(): mongoose.Schema | null {
			return this.DBSchema;
		},
	};
}

try {
	dbInstance = db();
} catch (error) {
	console.log('error connecting to db');
	process.exit(1011);
}

export default dbInstance;
