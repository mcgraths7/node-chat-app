const path     = require('path'),
			express  = require('express'),
			http     = require('http'),
			socketIO = require('socket.io');

const publicPath        = path.join(__dirname, '../public'),
      {generateMessage} = require('./utils/message'),
      {isRealString}    = require('./utils/validation'),
			{Users}           = require('./utils/users');
 
const port = process.env.PORT || 3000;

let app = express();

let server = http.createServer(app);
let io = socketIO(server);
let userList = new Users();
let currentUser;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');
	currentUser = userList.getUser(socket.id);
	
	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and Room Name required');
		}
		socket.join(params.room);
		userList.removeUser(socket.id);
		userList.addUser(socket.id, params.name, params.room);
		
		
		io.to(params.room).emit('updateUserList', userList.getUserList(params.room));
		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
		
		callback();
	});
	
	
	socket.on('createMessage', (message, callback) => {
		let user = userList.getUser(socket.id);
		if (user && isRealString(message.text)) {
			io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
		}
		callback();
	});
	
	socket.on('disconnect', (reason) => {
		console.log('Client disconnected. Reason:', reason);
		let user = userList.removeUser(socket.id);
		
		if (user) {
			io.to(user.room).emit('updateUserList', userList.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`));
		}
	});
});

app.get('/', (req, res) => {
	res.sendfile(publicPath);
});

server.listen(port, () => {
	console.log(`Now listening on port ${port}`);
});