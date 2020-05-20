import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import WatchList from '../models/watchList';

async function getWatchlist(
	request: FastifyRequest,
	reply: FastifyReply<ServerResponse>
): Promise<string[] | null> {
	const wl = await WatchList.findOne({
		user: request.session.userId,
	});
	if (!wl) return null;
	return wl.symbols;
}

async function updateWatchlist(
	request: FastifyRequest,
	reply: FastifyReply<{}>
): Promise<{}> {
	let { watchList } = request.body;
	if (!watchList) {
		reply.code(400);
		return { status: 'no data' };
	}

	watchList = [...new Set(watchList)];

	try {
		let doc = await WatchList.findOne({
			user: request.session.userId,
		});
		if (doc) {
			doc.symbols = watchList;
		} else {
			doc = new WatchList({
				user: request.session.userId,
				symbols: watchList,
			});
		}
		const result = await doc.save();
		console.log('updated watchlist', result);
		return { data: result };
	} catch (err) {
		console.log({ postWatchlistError: err });
		reply.code(500);
		return { status: err.message };
	}
}

export { updateWatchlist, getWatchlist };
