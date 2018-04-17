const mongoose  = require('mongoose'),
			_         = require('lodash');
			
const {UserSchema, User} = require('./users'),
      {RoomSchema, Room} = require('./rooms');

const Schema = mongoose.Schema;

const UserRoomSchema = new Schema({
  user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
  },
  room: {
		type: Schema.Types.ObjectId,
		ref: 'Room'
	}
});

// Instance Methods
UserRoomSchema.methods.toJSON = function() {
	let room = this;
	let roomObj = room.toObject();
	return _.pick(roomObj, ['user._id', 'room._id']);
};

// Model Methods
// UserRoomSchema.statics.findRoomsByUserId = async function(userId) {
//   try {
//     const UserRoom = this;

//     const userRooms = await UserRoom.find({user: userId});
//     console.log(userRooms);
//     return userRooms;
//   } catch (e) {
//     return e;
//   }
// }

const UserRoom = mongoose.model('UserRoom', UserRoomSchema);

module.exports = {UserRoomSchema, UserRoom};