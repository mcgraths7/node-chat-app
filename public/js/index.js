let socket = io();
socket.on('connect', function() {
	
	console.log('Connected to server');
	
	socket.emit('createMessage', {
		from: 'client',
		message: 'hello',
		createdAt: new Date().getTime()
	});
});

socket.on('disconnect', function() {
	console.log('Disconnected');
});

socket.on('newMessage', function(data) {
	console.log(`${data.createdAt} ${data.from}: ${data.message}`);
});