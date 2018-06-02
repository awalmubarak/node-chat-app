const expect = require('expect');
const { generateMessage, generateLocationMessage} = require('./message');


describe('Message Utils', ()=>{
    var from = 'yhunng';
    var text = 'Hey there';
    var lat = 447373;
    var lon = -54.564;
    describe('generateMessage', ()=>{
        it('should generate correct message object', (done) => {
            var message = generateMessage(from, text);
            expect(message).toExist();
            expect(message).toInclude({
                from, text
            });
            expect(message.createdAt).toBeA('number');
            done();
        });

    });
   
    describe('generateLocationMessage', ()=>{
        it('should generate correct location message', () => {
            var locationMessage = generateLocationMessage(from, lat, lon);
            expect(locationMessage).toExist();
            expect(locationMessage.from).toBe(from);
            expect(locationMessage.url).toBe(`https://www.google.com/maps?q=${lat},${lon}`);
            expect(locationMessage.createdAt).toBeA('number');
        });
    });
    
});