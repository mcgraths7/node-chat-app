let socket = io();
let messageBoxSelector = $('[name=message]');
let appendMessages = (item) => {
	$('#messages').append(item);
};

socket.on('connect', function() {
	console.log('Connected to server');
});

socket.on('disconnect', function() {
	console.log('Disconnected');
});

socket.on('newMessage', function(message) {
	let formattedTime = moment(message.createdAt).format('h:mm a');
	// console.log(`[${formattedTime}] ${message.from}: ${message.text}`);
	// let li = $('<li></li>');
	// li.text(`[${formattedTime}] ${message.from}: ${message.text}`);
	// appendMessages(li);
	
	let template = $('#message-template').html();
	let html = Mustache.render(template, {
		from: message.from,
		text: message.text,
		createdAt: formattedTime
	});
	$('#messages').append(html);
});

socket.on('newLocationMessage', function(locationMessage) {
	let formattedTime = moment(locationMessage.createdAt).format('h:mm a');
	let template = $('#location-message-template').html();
	let html = Mustache.render(template, {
		from: locationMessage.from,
		url: locationMessage.url,
		createdAt: formattedTime
	});
	$('#messages').append(html);
});

$('#message-form').on('submit', function(e) {
	e.preventDefault();
	socket.emit('createMessage', {
		from: 'User',
		text: messageBoxSelector.val()
	}, function() {
		messageBoxSelector.val('');
	})
});

let locationButton = $('#send-location');

locationButton.on('click', function() {
	if (!navigator.geolocation) {
		return alert('This feature is not supported on your browser.');
	}
	locationButton.attr('disabled', 'disabled').text('Sending location...');
	
	navigator.geolocation.getCurrentPosition(function(position) {
		locationButton.removeAttr('disabled').text('Send location');
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function(err) {
		alert('Unable to fetch location');
		locationButton.removeAttr('disabled');
	});
	
});

