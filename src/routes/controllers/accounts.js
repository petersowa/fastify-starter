import AccountModel from '../../models/accountModel';
import { HoldingsModel, PositionModel } from '../../models/holdingsModel';

async function getAccounts(request) {
	const accounts = await AccountModel.findOne({
		user: request.session.userId,
	}).populate('holdings');

	if (!accounts) return null;
	return accounts;
}

const deletePosition = async function (request, reply) {
	const { holdingId, positionId } = request.body;
	if (!holdingId || !positionId) {
		reply.code(400);
		return { status: 'bad request' };
	}

	try {
		const holdingsDoc = await HoldingsModel.findById(holdingId);
		holdingsDoc?.positions.remove(positionId);
		await holdingsDoc?.save();
		return { positionId } || {};
	} catch (err) {
		reply.code(500);
		return { status: err.message };
	}
};

const addHoldingPosition = async function (request, reply) {
	const { holdingsId, position } = request.body;
	if (!holdingsId || !position) {
		reply.code(400);
		return { status: 'bad request' };
	}

	console.log({ holdingsId });

	const {
		date,
		symbol,
		type,
		quantity,
		cost,
		fees,
		purchasePrice,
		purchaseDate,
	} = position;

	const newPosition = new PositionModel({
		date: date || new Date(),
		symbol,
		type,
		quantity,
		cost,
		fees,
		purchasePrice,
		purchaseDate,
	});

	try {
		const userAccount = await AccountModel.findOne({
			user: request.session.userId,
		});

		if (userAccount) {
			const holdingsDoc = await HoldingsModel.findById(holdingsId);
			if (holdingsDoc) {
				holdingsDoc.positions.push(newPosition);
				await holdingsDoc.save();
			}
		} else {
			console.error('holding not found');
			// const newHoldings = new HoldingsModel({});
			// newHoldings.positions.push(newPosition);
			// userAccount = new AccountModel({
			// 	user: request.session.userId,
			// 	holdings: [newHoldings.id],
			// });
			// const doc = await userAccount.save();
			// const holdingsDoc = await newHoldings.save();
			// console.log('created account', doc, holdingsDoc);
		}
	} catch (err) {
		console.log({ createNewAccountError: err });
		reply.code(500);
		return { status: err.message };
	}

	return { newPosition };
};

// const addHoldingsAccount
const addHoldingsAccount = async function (request, reply) {
	const { holdingsName } = request.body;

	if (!holdingsName) {
		reply.code(400);
		return { status: 'bad request' };
	}

	try {
		let userAccount = await AccountModel.findOne({
			user: request.session.userId,
		});

		if (!userAccount) {
			userAccount = new AccountModel({ user: request.session.userId });
		}

		if (userAccount) {
			const holdingsDoc = userAccount.holdings.find(
				(holding) => holding.name === holdingsName
			);
			if (holdingsDoc) {
				reply.code(409);
				return { id: holdingsDoc.id };
			} else {
				const holdingsDoc = new HoldingsModel({ name: holdingsName });
				const result = await holdingsDoc.save();
				userAccount.holdings.push(holdingsDoc._id);
				await userAccount.save();
				return { data: result };
			}
		} else {
			reply.code(500);
			return { status: 'unable to find user' };
		}
	} catch (err) {
		reply.code(500);
		return { status: err.message };
	}
};

const deleteHoldingsAccount = async function (request, reply) {
	const { holdingsId } = request.body;

	if (!holdingsId) {
		reply.code(400);
		return { status: 'bad request' };
	}

	try {
		const userAccount = await AccountModel.findOne({
			user: request.session.userId,
		});
		console.log({ userAccount });
		if (userAccount) {
			userAccount.holdings.pull(holdingsId);
			await userAccount.save();
			const holdingsDoc = await HoldingsModel.findByIdAndDelete(
				holdingsId
			);
			return { data: holdingsDoc };
		} else {
			reply.code(500);
			return { status: 'unable to find user' };
		}
	} catch (err) {
		reply.code(500);
		console.log({ err });
		return { status: err.message };
	}
};

const updateHoldingPosition = async function (request, reply) {
	const { position, holdingId } = request.body;
	if (!position || !holdingId) {
		reply.code(400);
		return { status: 'bad request' };
	}

	try {
		const holdingsDoc = await HoldingsModel.findById(holdingId);
		if (holdingsDoc) {
			holdingsDoc.positions.every((pos, i, positions) => {
				if (pos._id == position._id) {
					positions[i] = position;
					return false;
				}
				return true;
			});
			await holdingsDoc.save();
			return { id: holdingsDoc.id };
		}
	} catch (err) {
		reply.code(500);
		return { status: err.message };
	}

	return { status: 'position update request' };
};

export {
	addHoldingPosition,
	getAccounts,
	deletePosition,
	updateHoldingPosition,
	addHoldingsAccount,
	deleteHoldingsAccount,
};
