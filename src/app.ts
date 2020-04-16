import './utils/setup';
import { UserModel } from './models/userModel';
import { DataModel } from './models/dataModel';
import { hash, compare } from './utils/encrypt';
import './server/config';

DataModel.find({ name: 'pinky' }, (err, cat) => {
	if (err) {
		return console.log(err);
	}
	if (cat.length === 1) {
		const nameData = new DataModel({ name: 'pinky' });
		console.log(nameData.save().then((res) => console.log(res.id)));
	}
	console.log(cat);
});

const PW =
	'this is a long passphrase password to test 123. this is even longer 9999';
hash(PW)
	.then((hash) => {
		compare(PW + '.', hash).then((isEqual) => console.log({ isEqual }));
		const user = new UserModel({
			name: 'joe',
			password: hash,
			email: 'alpha2@test.com',
		});

		user.save().catch((err) => console.log('got an error saving data'));
	})
	.catch((err) => console.log(err));

///
