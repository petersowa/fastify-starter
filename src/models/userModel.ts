import dbInstance from '../utils/db';

interface UserModel {
	name: string;
	password: string;
	email: string;
}

const schema = {
	name: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
};

const UserModel = dbInstance.createModel<UserModel>('Users', schema);
// console.log(dbInstance.getSchema());

export { UserModel };
