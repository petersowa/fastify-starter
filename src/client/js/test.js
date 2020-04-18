import io from 'socket.io-client';
import App from './quote.svelte';
import '../styles/main.css';

const app = new App({ target: document.getElementById('app'), data: {} });
console.log({ app });

const socket = io();

const elements = {
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
};

for (const element in elements) {
	const elem = document.getElementById(element);
	console.log(elem);
	if (elem) {
		elements[element].elem = elem;
		for (const event in elements[element].events) {
			console.log(event, elements[element].events[event]);
			elem.addEventListener(event, elements[element].events[event]);
		}
	}
}

socket.on('connect', () => {
	console.log('connected ');
	socket.emit('query', 'query data');
});

socket.on('update', (msg) => {
	console.log(msg);
});
