import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import AccountModel, { AccountInterface } from '../models/accountModel';
import HoldingsModel, { HoldingsInterface } from '../models/holdingsModel';

async function getAccounts(
	request: FastifyRequest,
	reply: FastifyReply<ServerResponse>
): Promise<AccountInterface | null> {
	const accounts = await Account.findOne({
		user: request.session.userId,
	});
	if (!accounts) return null;
	console.log({ accounts });
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
		const newHoldings = new HoldingsModel({
			holdings: [
				{
					date: new Date(),
					type: 'stock',
					quantity: 12,
					cost: 9.99,
					fees: 9.99,
				},
			],
		});
		userAccount = new AccountModel({
			user: request.session.userId,
			holdings: newHoldings.id,
		});
		try {
			const doc = await userAccount.save();
			const holdingDoc = await newHoldings.save();
			console.log('created account', doc, holdingDoc);
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
