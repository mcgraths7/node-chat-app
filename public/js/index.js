let socket = io();
socket.on('connect', function() {
	console.log('Connected to server');
	// socket.emit('createEmail', {
	// 	to: "steven@email.com",
	// 	text: "wanna get some dinner?"
	// });
	//
	//
	socket.emit('createMessage', {
		from: 'client',
		message: 'hello'
	});
});

socket.on('disconnect', function() {
	console.log('Disconnected');
});

socket.on('newEmail', function(data) {
	console.log('New Email!', data);
});

socket.on('newMessage', function(data) {
	console.log(`${data.from}: ${data.message}`);
});