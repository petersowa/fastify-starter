import dbInstance from '../utils/db';

interface DataModelType {
	name: string;
}

const schema = {
	name: { type: String, required: true },
};

const DataModel = dbInstance.createModel<DataModelType>('Cat', schema);

export { DataModel };
