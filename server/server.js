require('./config/config');
require('./db/mongoose');

//Load third party dependencies
const path       = require('path'),
			express    = require('express'),
			http     	 = require('http'),
			socketIO   = require('socket.io'),
			_          = require('lodash'),
			{ObjectID} = require('mongodb'),
			bcrypt 	   = require('bcryptjs'),
			bodyParser = require('body-parser');
//Load Utilities
const publicPath        = path.join(__dirname, '../public'),
	  	{generateMessage} = require('./utils/message'),
	  	{isRealString}    = require('./utils/validation'),
			{Users}           = require('./utils/users');

//Load Models
const	{User}     				= require('./db/models/users');


// Load Middleware
const {authenticate} = require('./middleware/authenticate');
 
const port = process.env.PORT || 3000;

let app = express();

let server = http.createServer(app);
let io = socketIO(server);
let userList = new Users();

// app.use(express.static(publicPath));
app.use(bodyParser.json());

//Socket logic
io.on('connection', (socket) => {
	console.log('New user connected');
	
	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and Room Name required');
		}
		
		if (userList.getUserList(params.room).length >= 25) {
			return callback('Room is full (Max capacity is 25');
		}
		
		let duplicate = userList.getUserList(params.room).filter((user) => user === params.name);
		
		if (duplicate[0]) {
			return callback('Name is already in use. Try another name');
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
			io.emit('newMessage', generateMessage(user.name, message.text));
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

// app.get('/', (req, res) => {
// 	res.sendFile(publicPath);
// });

// server.listen(port, () => {
// 	console.log(`Now listening on port ${port}`);
// });

//Login and Create new users logic
app.get('/users', async (req, res) => {
	try {
		const users = await User.find();
		res.send({users});
	} catch (e) {
		res.status(400).send();
	}
});

app.post('/users', async (req, res) => {
	try {
		let body = _.pick(req.body, ['username', 'email', 'password']);
		const user = new User({
			username: body.username,
			email: body.email,
			password: body.password
		});
		await user.save();
		const token = await user.generateAuthToken();
		res.header('x-auth', token).send(user);
	} catch (e) {
		res.status(400).send(e);
	}
});

app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

app.post('/users/login', async (req, res) => {
	try {
		const body = _.pick(req.body, ['email', 'password', 'loggedIn']);
		const user = await User.findByCredentials(body.email, body.password);
		const token = await user.generateAuthToken();
		res.header('x-auth', token).send(user);
	} catch (e) {
		res.status(400).send();
	}
});

app.delete('/users/me/token', authenticate, async (req, res) => {
	try {
		await req.user.removeToken(req.token);
		res.status(200).send();
	} catch (e) {
		res.status(400).send();
	}
});



app.listen(port, () => {
	console.log(`Now listening on port ${port}`);
});