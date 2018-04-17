const mongoose  = require('mongoose'),
			_         = require('lodash');
			
const {UserSchema, User} = require('./users');

const Schema = mongoose.Schema;

let RoomSchema = new Schema ({
	title: {
		type: 'String',
		required: true,
		unique: true,
	},
	_creator: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	users: [{
		type: Schema.Types.ObjectId, 
		ref: 'User'
	}],
	admins: [{
		type: Schema.Types.ObjectId, 
		ref: 'User'
	}]
});
// Instance Methods
RoomSchema.methods.toJSON = function() {
	let room = this;
	let roomObj = room.toObject();
	return _.pick(roomObj, ['title', '_id', '_creator']);
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