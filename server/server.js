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
	socket.on('disconnect', (reason) => {
		console.log('Client disconnected. Reason:', reason);
	});
});

app.get('/', (req, res) => {
	res.sendfile(publicPath);
});

io.on('connection', (socket) => {
	socket.emit('news', {hello: 'world'});
	socket.on('my other event', (data) => {
		console.log(data);
	});
});

server.listen(port, () => {
	console.log(`Now listening on port ${port}`);
});