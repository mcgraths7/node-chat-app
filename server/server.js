const path     = require('path'),
			express  = require('express'),
			http     = require('http'),
			socketIO = require('socket.io');

const publicPath        = path.join(__dirname, '../public'),
      {generateMessage} = require('./utils/message'),
      {isRealString}    = require('./utils/validation');

const port = process.env.PORT || 3000;

let app = express();

let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');
	
	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			callback('Name and Room Name required');
		}
		socket.join(params.room);
		
		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
		
		socket.on('createMessage', (message, callback) => {
			console.log(`${params.name}: ${message.text}`);
			io.to(params.room).emit('newMessage', generateMessage(params.name, message.text));
			callback();
		});
		
		callback();
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