import hbs from 'handlebars';
import view from '@fastify/view';
import * as fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

import templateRoutes from '../routes/main';

hbs.registerHelper('debugJSON', (value) => {
	return new hbs.SafeString(`<pre>${JSON.stringify(value, null, 2)}</pre>`);
});

// add template support
const register = (
	app: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>
): void => {
	app.register(view, {
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
				registerForm: './partials/forms/register.hbs',
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
