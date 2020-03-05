import './utils/setup';
import fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { UserModel } from './models/userModel';
import { DataModel } from './models/dataModel';
import { hash, compare } from './utils/encrypt';
import authRoutes from './routes/auth';

let count = 0;

const PORT: number = parseInt(process.env.PORT || '3000', 10);

const server: fastify.FastifyInstance<
	Server,
	IncomingMessage,
	ServerResponse
> = fastify({ logger: true, http2: false });

server.register(authRoutes, { prefix: '/auth' });

const opts: fastify.RouteShorthandOptions = {
	schema: {
		response: {
			200: {
				type: 'object',
				properties: {
					pong: {
						type: 'string',
					},
					count: {
						type: 'number',
					},
				},
			},
		},
	},
};

const postCounter: fastify.RouteShorthandOptions = {
	schema: {
		body: {
			type: 'object',
			required: ['test'],
			properties: {
				test: {
					type: 'number',
				},
			},
		},
		response: {
			200: {
				type: 'object',
				properties: {
					count: {
						type: 'number',
					},
				},
			},
		},
	},
};

server.get('/ping', opts, async (request, reply) => {
	return { pong: 'it worked!', count };
});

server.post('/counter', postCounter, async (request, reply) => {
	request.log.info('request to increment count');
	console.log(request.body);
	++count;
	return { count };
});

server.listen(PORT, '0.0.0.0', err => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}
});

DataModel.find({ name: 'pinky' }, (err, cat) => {
	if (err) {
		return console.log(err);
	}
	if (cat.length === 1) {
		const nameData = new DataModel({ name: 'pinky' });
		console.log(nameData.save().then(res => console.log(res.id)));
	}
	console.log(cat);
});

const PW =
	'this is a long passphrase password to test 123. this is even longer 9999';
hash(PW)
	.then(hash => {
		console.log(hash);
		compare(PW + '.', hash).then(isEqual => console.log({ isEqual }));
		const user = new UserModel({
			name: 'joe',
			password: hash,
			email: 'alpha2@test.com',
		});

		user.save().catch(err => console.log('got an error saving data'));
	})
	.catch(err => console.log(err));

///
