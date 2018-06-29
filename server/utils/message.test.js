const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        let from = 'Mike';
        let text = 'Message';
        let message = generateMessage(from, text);

        expect(typeof(message.createdAt)).toBe('number');
        expect(message).toMatchObject({from, text});
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location', () => {
        let from = 'Jack';
        let latitude = 15;
        let longitude = 90;
        let url = 'https://www.google.com/maps?q=15,90';
        let message = generateLocationMessage(from, latitude, longitude);

        expect(typeof(message.createdAt)).toBe('number');
        expect(message).toMatchObject({from, url});
    });
});