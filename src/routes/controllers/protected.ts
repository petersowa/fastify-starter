import * as fastify from 'fastify';
import { ServerResponse } from 'http';

interface UserSession extends fastify.Session {
	username?: string;
}

const checkSessionAuth: (
	request: fastify.FastifyRequest,
	reply: fastify.FastifyReply<ServerResponse>
) => Promise<void> = async (request, reply) => {
	if (!(request.session as UserSession).username) {
		reply.status(401).send({ error: 'not authorized' });
	}
};

export { checkSessionAuth };
