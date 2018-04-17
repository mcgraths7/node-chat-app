const mongoose  = require('mongoose'),
			_         = require('lodash');
			
const {UserSchema} = require('./users');

const Schema = mongoose.Schema;

let RoomSchema = {
	title: {
		type: 'String',
		required: true,
		unique: true,
	},
	owner: {
		user: UserSchema,
		required: true
	},
	users: [{
		user: UserSchema,
		unique: true
	}],
	admins: [{
		user: UserSchema,
		unique: true
	}]
}
// Instance Methods
RoomSchema.methods.toJSON = function() {
	let room = this;
	let roomObj = room.toObject();
	return _.pick(roomObj, ['title', '_id', 'owner']);
};

// Model Methods
RoomSchema.statics.findByRoomName = function(roomName) {
	return Room.findOne({roomName}).then((room) => {
		if (!room) {
			return Promise.reject();
		}
		Promise.resolve(room);
	});
};

const Room = mongoose.model('Room', RoomSchema);

module.exports = {Room, RoomSchema};