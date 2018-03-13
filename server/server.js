const path     = require('path'),
			express  = require('express'),
			http     = require('http'),
			socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const {generateMessage} = require('./utils/message');
const port = process.env.PORT || 3000;

let app = express();

let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');
	
	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));
	
	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user connected'));
	
	socket.on('createMessage', (message, callback) => {
		console.log(`${message.from}: ${message.text}`);
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback('This is from the server');
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