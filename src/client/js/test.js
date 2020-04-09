import io from 'socket.io-client';

const socket = io();
const loginCancelBtn = document.getElementById('login-cancel-btn');
const loginSubmit = document.getElementById('login-form');
const loginButton = document.getElementById('login-button');
const modal = document.getElementById('modal');

const loginForm = `
<form id="login-form" class="login-form" action='/auth/login' method="post">
	Login Form 2
	<input type="text" placeholder="email" name="username" />
	<input type="password" placeholder="password" name="password" />
	<div class="h-controls">
		<button type="submit">Submit</button>
		<button id="login-cancel-btn" type="button">
			Cancel
		</button>
	</div>
	<input type="hidden" value="" name="_csrf" />
</form>
`;

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
	modal.classList.remove('modal--show');
	setTimeout(() => modal.classList.remove('modal--hide'), 300);
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
	// modal.innerHTML = loginForm;
	modal.classList.add('modal--hide');
	setTimeout(() => modal.classList.add('modal--show'), 10);
});
