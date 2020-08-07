import io from 'socket.io-client';
import '../styles/main.css';
import '../styles/icons.css';
import '../styles/content.scss';
import { Observable } from 'rxjs';

// setup svelte app
const app = document.getElementById('app');
if (app) {
	import('./quote.svelte').then((App) => {
		new App.default({ target: app });
	});
}

const timeObserver = new Observable((subscriber) => {
	const intervalId = setInterval(() => {
		subscriber.next('tick');
	}, 500);
	return function unsubscribe() {
		clearInterval(intervalId);
	};
});

timeObserver.subscribe((val) => console.log(val));

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
				// const csrf = document
				// 	.querySelector('meta[name="csrf-token"]')
				// 	.getAttribute('content');
				// event.target._csrf.value = csrf;
				// alert('csrf=' + csrf);
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
