import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import AccountModel, { AccountInterface } from '../models/accountModel';
import {
	HoldingsModel,
	PositionModel,
	HoldingsInterface,
} from '../models/holdingsModel';

async function getAccounts(
	request: FastifyRequest,
	reply: FastifyReply<ServerResponse>
): Promise<AccountInterface | null> {
	const accounts = await AccountModel.findOne({
		user: request.session.userId,
	}).populate('holdings');
	console.log({ accounts });
	// if (accounts) {
	// 	accounts
	// 		.populate('holdings')
	// 		.exec((err, item) => console.log({ err, item }));
	// 	return accounts;
	// }
	if (!accounts) return null;
	return accounts;
}

async function updateAccount(
	request: FastifyRequest,
	reply: FastifyReply<{}>
): Promise<{}> {
	const { account, position } = request.body;
	if (!account || !position) {
		reply.code(400);
		return { status: 'bad request' };
	}

	let userAccount = await AccountModel.findOne({
		user: request.session.userId,
	});

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

	if (userAccount) {
		// await userAccount.populate('holdings').execPopulate();
		const holdingsDoc = await HoldingsModel.findById(
			userAccount.holdings[0]
		);
		if (holdingsDoc) {
			holdingsDoc.positions.push(newPosition);
			await holdingsDoc.save();
		}
	} else {
		const newHoldings = new HoldingsModel({});
		newHoldings.positions.push(newPosition);
		userAccount = new AccountModel({
			user: request.session.userId,
			holdings: [newHoldings.id],
		});
		try {
			const doc = await userAccount.save();
			const holdingsDoc = await newHoldings.save();
			// await newPosition.save();
			console.log('created account', doc, holdingsDoc);
		} catch (err) {
			console.log({ createNewAccountError: err });
		}
		console.log({ found: 'no user account' });
	}

	return { position };
}

export { updateAccount, getAccounts };
