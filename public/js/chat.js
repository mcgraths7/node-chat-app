let socket = io();
let messageBoxSelector = $('[name=message]');

let scrollToBottom = function() {
	//Selectors
	
	let messages = $('#messages');
	let newMessage = messages.children('li:last-child');
	
	//Heights
	
	let clientHeight = messages.prop('clientHeight');
	let scrollTop = messages.prop('scrollTop');
	let scrollHeight = messages.prop('scrollHeight');
	let newMessageHeight = newMessage.innerHeight();
	let previousMessageHeight = newMessage.prev().innerHeight();
	
	if (clientHeight + scrollTop + previousMessageHeight + newMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	}
	
};
let appendMessages = (item) => {
	$('#messages').append(item);
};

socket.on('connect', function() {
	let params = $.deparam(window.location.search);
	socket.emit('join', params, function(err) {
		if (err) {
			alert(err);
			window.location.href = "/";
		} else {
			console.log('Welcome to the room');
		}
	})
	
});

socket.on('updateUserList', function(usersList) {
	let ol = $('<ol></ol>');
	usersList.forEach(function(user) {
		ol.append($('<li></li>').text(user));
	});
	
	$('#users').html(ol);
	
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
	scrollToBottom();
});

$('#message-form').on('submit', function(e) {
	e.preventDefault();
	socket.emit('createMessage', {
		text: messageBoxSelector.val()
	}, function() {
		messageBoxSelector.val('');
	})
});

