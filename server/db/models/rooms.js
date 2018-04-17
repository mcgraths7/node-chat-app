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