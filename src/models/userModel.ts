import dbInstance from '../utils/db';
import { hash, compare } from '../utils/encrypt';
import { Schema, Document } from 'mongoose';

interface UserModel extends Document {
	name: string;
	password: string;
	email: string;
	validatePassword: (pw: string) => Promise<boolean>;
}

const schema: Schema<UserModel> = new Schema({
	name: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
});

schema.pre('save', async function (next) {
	const user = this as UserModel;
	if (!user.isModified('password')) return next(null);
	try {
		user.password = await hash(user.password);
		return next(null);
	} catch (err) {
		return next(err as undefined);
	}
});

schema.methods.validatePassword = async function (
	pw: string
): Promise<boolean> {
	const user = this as unknown as UserModel;
	return compare(pw, user.password);
};

const UserModel = dbInstance.createModel<UserModel>('Users', schema);
// console.log(dbInstance.getSchema());

export { UserModel };
