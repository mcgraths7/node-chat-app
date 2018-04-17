const mongoose  = require('mongoose'),
		validator   = require('validator'),
		jwt         = require('jsonwebtoken'),
		bcrypt      = require('bcryptjs'),
		_           = require('lodash');

const Schema = mongoose.Schema;
const SALT_FACTOR = 8;

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
	loggedIn: {
		type: Boolean,
		default: false,
	},
	username: {
		type: 'String',
		required: true,
		unique: true,
		validator: {
			validator: validator.isAlphanumeric,
			message: `{VALUE} must only contain letters and numbers`
		}
	},
	password: {
		type: String,
		minlength: 8,
		required: true,
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
UserSchema.methods.toJSON = function() {
	let user = this;
	let userObj = user.toObject();
	return _.pick(userObj, ['username', '_id', 'email', 'loggedIn']);
};
UserSchema.methods.generateAuthToken = function() {
	let user = this;
	let access = 'auth';
	let token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
	user.tokens.push({access, token})
};
UserSchema.methods.removeToken = function() {
	let user = this;
	return user.update({
		$pull: {
			tokens: {
				token
			}
		}
	});
};

// Model Methods
UserSchema.statics.findByToken = function(token) {
	let User = this;
	
	try {
		let decoded = jwt.verify(token, process.env.JWT_SECRET);
	} catch (e) {
		return Promise.reject();
	}
};
UserSchema.statics.findByCredentials = function(email, password) {
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
};

UserSchema.statics.findByEmail = function(email) {
	return User.findOne({email}).then((user) => {
		if (!user) {
			return Promise.reject();
		}
		Promise.resolve(user);
	});
}

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

module.exports = {User, UserSchema};