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
	let template = $('#message-template').html();
	let html = Mustache.render(template, {
		from: message.from,
		text: message.text,
		createdAt: formattedTime
	});
	appendMessages(html);
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

