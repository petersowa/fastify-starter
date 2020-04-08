import io from 'socket.io-client';

const socket = io();
const loginCancelBtn = document.getElementById('login-cancel-btn');
const loginSubmit = document.getElementById('login-form');
const loginButton = document.getElementById('login-button');
const loginModal = document.getElementById('login-modal');

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

loginCancelBtn.addEventListener('click', () => {
	loginModal.classList.remove('login--show');
	setTimeout(() => loginModal.classList.remove('login--hide'), 300);
	// window.history.back();
});

loginSubmit.addEventListener('submit', (event) => {
	// event.preventDefault();
	// const csrf = /_csrf=(\S*);/.exec(document.cookie)[1];
	const csrf = document
		.querySelector('meta[name="csrf-token"]')
		.getAttribute('content');
	event.target._csrf.value = csrf;
});

loginButton.addEventListener('click', () => {
	loginModal.classList.add('login--hide');
	setTimeout(() => loginModal.classList.add('login--show'), 10);
});
