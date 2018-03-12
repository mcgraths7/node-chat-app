const path     = require('path'),
			express  = require('express'),
			http     = require('http'),
			socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

let app = express();

let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');
	
	socket.emit('newMessage', {
		from: 'Admin',
		text: 'Welcome to the chat room!'
	});
	
	socket.broadcast.emit('newMessage', {
		from: 'Admin',
		text: 'New User has joined'
	});
	
	socket.on('createMessage', (message) => {
		console.log(`${message.from}: ${message.text}`);
		io.emit('newMessage', {
			from: message.from,
			text: message.text,
			createdAt: new Date().getTime()
		});
		
		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// })
	});
	
	socket.on('disconnect', (reason) => {
		console.log('Client disconnected. Reason:', reason);
	});
});



app.get('/', (req, res) => {
	res.sendfile(publicPath);
});

server.listen(port, () => {
	console.log(`Now listening on port ${port}`);
});