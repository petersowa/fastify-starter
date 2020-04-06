import io from 'socket.io-client';

const socket = io();

socket.on('connect', () => {
	console.log('connected');
	socket.emit('query', 'query data');
});

socket.on('update', (msg) => {
	console.log(msg);
});

document.getElementById('query-button').addEventListener('click', () => {
	socket.emit('query', 'button clicked' + socket.id);
});

const loginCancelBtn = document.getElementById('login-cancel-btn');
loginCancelBtn.addEventListener('click', () => {
	window.history.back();
});

const loginSubmit = document.getElementById('login-form');

loginSubmit.addEventListener('submit', (event) => {
	// event.preventDefault();
	// const csrf = /_csrf=(\S*);/.exec(document.cookie)[1];
	const csrf = document
		.querySelector('meta[name="csrf-token"]')
		.getAttribute('content');
	event.target._csrf.value = csrf;
});
