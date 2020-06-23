import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import AccountModel, { AccountInterface } from '../models/accountModel';
import { Document } from 'mongoose';
import {
	HoldingsModel,
	HoldingModel,
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
	let userAccount = await AccountModel.findOne({
		user: request.session.userId,
	});
	if (userAccount) {
		await userAccount.populate('holdings');
		console.log({ found: userAccount });
	} else {
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
		const newHolding = new HoldingModel({
			date: new Date(),
			symbol,
			type,
			quantity,
			cost,
			fees,
			purchasePrice,
			purchaseDate,
		});
		const newHoldings = new HoldingsModel({
			holdings: [newHolding],
		});
		userAccount = new AccountModel({
			user: request.session.userId,
			holdings: newHoldings.id,
		});
		try {
			const doc = await userAccount.save();
			const holdingsDoc = await newHoldings.save();
			const holdingDoc = await newHolding.save();
			console.log('created account', doc, holdingsDoc);
		} catch (err) {
			console.log({ createNewAccountError: err });
		}
		console.log({ found: 'no user account' });
	}
	if (!account) {
		reply.code(400);
		return { status: 'no data' };
	}
	console.log({ account, position });
	return { position };
}

export { updateAccount, getAccounts };
