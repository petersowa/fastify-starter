const checkSessionAuth = async (request, reply) => {
	if (!request.session.username) {
		reply.status(401).send({ error: 'not authorized' });
	}
};

export { checkSessionAuth };
