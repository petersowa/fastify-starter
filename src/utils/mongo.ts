import mongoose from 'mongoose';

type CallbackType = (() => void) | null;

const { MONGODB_NAME } = process.env;

async function connect(connectedFn: CallbackType = null): Promise<void> {
	if (!MONGODB_NAME) {
		console.error('No mongodb name provided');
		throw new Error('mongodb string not provided');
	}
	mongoose.set('strictQuery', false);
	await mongoose.connect(MONGODB_NAME);
	const db = mongoose.connection;
	// console.log({ db });
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function () {
		console.log('db connected');
		if (connectedFn !== null) connectedFn();
	});
}

export { connect };
