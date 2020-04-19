import io from 'socket.io-client';
import App from './quote.svelte';
import '../styles/main.css';

// setup svelte app
const app = document.getElementById('app');
app && new App({ target: app, data: {} });

// setup sockets
const socket = io();
socket.on('connect', () => {
	console.log('connected ');
	socket.emit('query', 'query data');
});

socket.on('update', (msg) => {
	console.log(msg);
});

// setup dom elements
const idTable = {
	'form-cancel': {
		events: {
			click: () => {
				// modal.classList.remove('modal--show');
				// setTimeout(() => modal.classList.remove('modal--hide'), 300);
				window.history.back();
			},
		},
	},
	'form-submit': {
		events: {
			submit: (event) => {
				// event.preventDefault();
				// const csrf = /_csrf=(\S*);/.exec(document.cookie)[1];
				const csrf = document
					.querySelector('meta[name="csrf-token"]')
					.getAttribute('content');
				event.target._csrf.value = csrf;
				console.log('submit');
			},
		},
	},
	'login-button': {},
	modal: {},
	'query-button': {
		events: {
			click: () => {
				console.log('query button click event');
				socket.emit('query', 'button clicked' + socket.id);
			},
		},
	},
	'menu-toggle': {
		events: {
			click: () => {
				console.log('menu-toggle');
			},
		},
	},
};

// add event listeners
for (const id in idTable) {
	const elem = document.getElementById(id);
	if (elem) {
		const el = idTable[id];
		el.elem = elem;
		for (const event in el.events) {
			elem.addEventListener(event, el.events[event]);
		}
	}
}
