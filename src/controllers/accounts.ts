import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import AccountModel, { AccountInterface } from '../models/accountModel';
import { HoldingsModel, PositionModel } from '../models/holdingsModel';

async function getAccounts(
	request: FastifyRequest,
	reply: FastifyReply<ServerResponse>
): Promise<AccountInterface | null> {
	const accounts = await AccountModel.findOne({
		user: request.session.userId,
	}).populate('holdings');
	console.log(JSON.stringify(accounts, null, 2));

	if (!accounts) return null;
	return accounts;
}

interface UpdateFunction<T> {
	(request: FastifyRequest, reply: FastifyReply<{}>): Promise<T>;
}
const deletePosition: UpdateFunction<{}> = async function (request, reply) {
	const { holdingId, positionId } = request.body;
	if (!holdingId || !positionId) {
		reply.code(400);
		return { status: 'bad request' };
	}

	try {
		const holdingsDoc = await HoldingsModel.findById(holdingId);
		const res = holdingsDoc?.positions.remove(positionId);
		await holdingsDoc?.save();
		return { positionId } || {};
	} catch (err) {
		reply.code(500);
		return { status: (err as Error).message };
	}
};

const addHoldingPosition: UpdateFunction<{}> = async function (request, reply) {
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
		return { status: (err as Error).message };
	}

	return { newPosition };
};

const updateHoldingPosition: UpdateFunction<{}> = async function (
	request,
	reply
) {
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
		return { status: (err as Error).message };
	}

	return { status: 'position update request' };
};

export {
	addHoldingPosition,
	getAccounts,
	deletePosition,
	updateHoldingPosition,
};
