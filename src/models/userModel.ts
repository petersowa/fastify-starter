import dbInstance from '../utils/db';

interface IUser {
	name: string;
	password: string;
	email: string;
}

const schema = {
	name: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
};

const UserModel = dbInstance.createModel<IUser>('Users', schema);
// console.log(dbInstance.getSchema());

export { UserModel };
