const checkSessionAuth = async (request, reply) => {
	if (!request.session.username) {
		return reply.status(401).send({ error: 'not authorized' });
	}
};

export { checkSessionAuth };
