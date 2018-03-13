const {generateMessage, generateLocationMessage} = require('../utils/message');

describe('#generateMessage', () => {
	test('should generate a message with from, text, and createdAt fields', () => {
		let message = generateMessage('Admin', 'Message');
		expect(message).toHaveProperty('from');
		expect(message).toHaveProperty('text');
		expect(message).toHaveProperty('createdAt');
	});
});

describe('#generateLocationMessage', () => {
	test('should generate a message with from, maps url, and createdAt field', () => {
		let message = (generateLocationMessage('Admin', 38, -75));
		expect(message).toHaveProperty('url');
		expect(message).toHaveProperty('from');
		expect(message).toHaveProperty('createdAt');
		expect(message.url).toEqual('https://www.google.com/maps?q=38,-75');
		expect(message.from).toBe('Admin');
		expect(message.createdAt).toBeTruthy();
	});
});