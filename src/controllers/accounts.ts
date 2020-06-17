import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import Account, { AccountInterface } from '../models/accountModel';

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
	if (!account) {
		reply.code(400);
		return { status: 'no data' };
	}
	console.log({ account, position });
	return {};
}

export { updateAccount, getAccounts };
