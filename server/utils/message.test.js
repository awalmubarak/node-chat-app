const expect = require('expect');
const {generateMessage} = require('./message');


describe('Message Utils', ()=>{
    var from = 'yhunng';
    var text = 'Hey there';
    it('should generate correct message object', (done)=>{
        var message = generateMessage(from, text);
        expect(message).toExist();
        expect(message).toInclude({
            from, text
        });
        expect(message.createdAt).toBeA('number');
        done();
    });
});