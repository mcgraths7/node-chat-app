let socket = io();

socket.on('connect', function() {
	console.log('Connected to server');
});

socket.on('disconnect', function() {
	console.log('Disconnected');
});

socket.on('newMessage', function(message) {
	console.log(`[${message.createdAt}] ${message.from}: ${message.text}`);
	let li = $('<li></li>');
	li.text(`${message.from}: ${message.text}`);
	$('#messages').append(li);
});

socket.on('newLocationMessage', function(locationMessage) {
	let li = $(`<li></li>`);
	let a = $('<a target="_blank">My Current Location</a>');
	li.text(`${locationMessage.from}: `);
	a.attr('href', `${locationMessage.url}`);
	li.append(a);
	$('#messages').append(li);
});

$('#message-form').on('submit', function(e) {
	e.preventDefault();
	socket.emit('createMessage', {
		from: 'User',
		text: jQuery('[name=message').val()
	}, function() {
	
	})
});

let locationButton = $('#send-location');

locationButton.on('click', function() {
	if (!navigator.geolocation) {
		return alert('This feature is not supported on your browser.');
	}
	
	navigator.geolocation.getCurrentPosition(function(position) {
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function(err) {
		alert('Unable to fetch location');
	});
	
});

