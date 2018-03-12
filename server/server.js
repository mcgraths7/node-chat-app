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
	
	// socket.emit('newEmail', {
	// 	from: 'me@example.com',
	// 	text: 'What up dawg?',
	// 	createdAt: new Date().getTime()
	// });
	//
	// socket.on('createEmail', (data) => {
	// 	console.log('data:', data);
	// });
	
	socket.emit('newMessage', {
		from: 'Server',
		message: 'test message'
	});
	
	socket.on('createMessage', (data) => {
		console.log(`${data.from}: ${data.message}`);
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