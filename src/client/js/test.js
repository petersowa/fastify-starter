import io from 'socket.io-client';

const socket = io();
const formCancelBtn = document.getElementById('form-cancel');
const formSubmit = document.getElementById('form-submit');
const loginButton = document.getElementById('login-button');
const modal = document.getElementById('modal');

import '../styles/main.css';

socket.on('connect', () => {
	console.log('connected ');
	socket.emit('query', 'query data');
});

socket.on('update', (msg) => {
	console.log(msg);
});

document.getElementById('query-button').addEventListener('click', () => {
	socket.emit('query', 'button clicked' + socket.id);
});

formCancelBtn.addEventListener('click', () => {
	// modal.classList.remove('modal--show');
	// setTimeout(() => modal.classList.remove('modal--hide'), 300);
	window.history.back();
});

formSubmit.addEventListener('submit', (event) => {
	// event.preventDefault();
	// const csrf = /_csrf=(\S*);/.exec(document.cookie)[1];
	const csrf = document
		.querySelector('meta[name="csrf-token"]')
		.getAttribute('content');
	event.target._csrf.value = csrf;
	console.log('submit');
});

// loginButton.addEventListener('click', () => {
// 	// modal.innerHTML = loginForm;
// 	modal.classList.add('modal--hide');
// 	setTimeout(() => modal.classList.add('modal--show'), 10);
// });
