const {User} = require('../db/models/users');

let authenticate = async (req, res, next) => {
	try {
		const token = req.header('x-auth');
		const user = await User.findByToken(token);
		req.user = user;
		req.token = token;
		next()	
	} catch (e) {
		res.status(401).send
	}
};

module.exports = {authenticate};