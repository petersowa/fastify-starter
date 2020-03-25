var socket = io();

socket.on('connect', () => {
	console.log('connected');
	socket.emit('query', 'query data');
});

socket.on('update', msg => {
	console.log(msg);
});

document.getElementById('query-button').addEventListener('click', () => {
	socket.emit('query', 'button clicked' + socket.id);
});

const loginCancelBtn = document.getElementById('login-cancel-btn');
loginCancelBtn.addEventListener('click', () => {
	window.history.back();
});
