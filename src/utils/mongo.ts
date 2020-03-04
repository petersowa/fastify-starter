import mongoose from 'mongoose';

type CallbackType = (() => void) | null;

const MONGODB_NAME = process.env.MONGODB_NAME;

function connect(connectedFn: CallbackType = null) {
	console.log('connecting db');
	if (!MONGODB_NAME) throw new Error('mongodb string not provided');
	mongoose.connect(MONGODB_NAME, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	});
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
		console.log('db connected');
		if (connectedFn !== null) connectedFn();
	});
}

export { connect };
