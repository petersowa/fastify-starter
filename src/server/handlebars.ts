import hbs from 'handlebars';
import fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

import templateRoutes from '../routes/template';

hbs.registerHelper('debugJSON', (value) => {
	return new hbs.SafeString(`<pre>${JSON.stringify(value, null, 2)}</pre>`);
});

hbs.registerHelper('getForm', () => {
	return 'loginForm';
});

// add template support
const register = (
	app: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>
): void => {
	app.register(require('point-of-view'), {
		engine: {
			handlebars: hbs,
		},
		includeViewExtension: true,
		templates: './views',
		layout: './partials/layout/layout',
		options: {
			partials: {
				main: './partials/layout/main.hbs',
				leftSidebar: './partials/layout/left-sidebar.hbs',
				rightSidebar: './partials/layout/right-sidebar.hbs',
				footer: './partials/layout/footer.hbs',
				header: './partials/layout/header.hbs',
				loginForm: './partials/forms/login.hbs',
				modal: './partials/components/modal.hbs',
				imagesLeftContent: './content/sidebar-images-left.hbs',
				imagesRightContent: './content/sidebar-images-right.hbs',
				head: './partials/components/head.hbs',
			},
		},
	});

	app.register(templateRoutes);
};

export default register;
