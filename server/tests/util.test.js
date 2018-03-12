const {generateMessage} = require('../utils/message');

describe('#generateMessage', () => {
	test('should generate a message with from, text, and createdAt fields', () => {
		let message = generateMessage('Admin', 'Message');
		expect(message).toHaveProperty('from');
		expect(message).toHaveProperty('text');
		expect(message).toHaveProperty('createdAt');
	});
});