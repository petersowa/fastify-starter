import mongoose, { SchemaDefinition, Document, Schema } from 'mongoose';
import { connect } from './mongo';

interface ICreateModel {
	DBSchema: Schema | null;
	createModel<T>(
		name: string,
		schema: SchemaDefinition
	): mongoose.Model<Document & T>;
	getSchema: () => Schema | null;
}

let dbInstance: ICreateModel;

try {
	dbInstance = db();
} catch (error) {
	console.log('error connecting to db');
	process.exit(1011);
}

function db(): ICreateModel {
	connect();

	return {
		DBSchema: null,
		createModel<T>(name: string, schema: SchemaDefinition) {
			this.DBSchema = new mongoose.Schema(schema);
			return mongoose.model<Document & T>(name, this.DBSchema);
		},
		getSchema() {
			return this.DBSchema;
		},
	};
}

export default dbInstance;
