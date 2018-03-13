const {generateMessage} = require('../utils/message'),
			{isRealString}    = require('../utils/validation');

describe('#generateMessage', () => {
	test('should generate a message with from, text, and createdAt fields', () => {
		let message = generateMessage('Admin', 'Message');
		expect(message).toHaveProperty('from');
		expect(message).toHaveProperty('text');
		expect(message).toHaveProperty('createdAt');
	});
});

describe('#isRealString', () => {
	test('should reject non string entries', () => {
		expect(isRealString(1)).toBeFalsy();
	});
	
	test('should reject an empty string', () => {
		expect(isRealString('    ')).toBeFalsy();
	});
	
	test('should accept a string', () => {
		expect(isRealString('hi')).toBeTruthy();
	});
});