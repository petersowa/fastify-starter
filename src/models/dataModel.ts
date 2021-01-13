import dbInstance from '../utils/db';
import { Document, Schema } from 'mongoose';

interface DataModelType extends Document {
	name: string;
}

const schema: Schema<DataModelType> = new Schema({
	name: { type: String, required: true },
});

const DataModel = dbInstance.createModel<DataModelType>('Cat', schema);

export { DataModel };
