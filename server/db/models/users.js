import { SSL_OP_LEGACY_SERVER_CONNECT } from 'constants';

const mongoose  = require('mongoose'),
		validator = require('validator'),
		jwt       = require('jsonwebtoken'),
		bcrypt    = require('bcryptjs'),
		_         = require('lodash');

const Schema = mongoose.Schema;
const SALT_FACTOR = 16;

let UserSchema = new Schema({
	email: {
		type: String,
		required: [true, 'Email is required'],
		minlength: 6,
		trim: true,
		unique: true,
		validator: {
			validator: validator.isEmail,
			message: `{VALUE} is not a valid email!`
		}
	},
	password: {
		required: true,
		minlength: 8,
		type: String
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});

// Instance Methods
UserSchema.methods = {
	toJSON() {
	let user = this;
	let userObj = user.toObject();
	return _.pick(userObj, ['_id', 'email']);
	},
	generateAuthToken() {
		let user = this;
		let access = 'auth';
		let token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
		user.tokens.push({acess, token})
	},
	removeToken() {
		let user = this;
		return user.update({
			$pull: {
				tokens: {
					token
				}
			}
		});
	}
};

// Model Methods

UserSchema.statics = {
	findByToken(token) {
		let User = this;
		
		try {
			let decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch {
			return Promise.reject();
		}
	},
	findByCredentials(email, password) {
		let User = this;

		return User.findOne({email}).then((user) => {
			if (!user) {
				return Promise.reject();
			}
			return new Promise((resolve, reject) => {
				bcrypt.compare(password, user.password, (err, response) => {
					if (response) {
						resolve(user);
					} else {
						reject();
					}
				})
			})
		});
	},
};

// Methods to call before each model is saved

UserSchema.pre('save', function(next) {
	let user = this;
	if (!user.isModified('password')) {
		return next();
	} else {
		bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				if (err) return next(err);
				user.password = hash;
				next();
			});
		})
	}
});

let User = mongoose.model('User', UserSchema);

module.exports = {User};