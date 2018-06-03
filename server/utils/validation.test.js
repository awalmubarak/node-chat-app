const expect = require('expect');
const {isRealString} = require('./validation');

describe('Utils/validation', ()=>{
    describe('isRealString', ()=>{
        it('should reject non-string values', ()=>{
            expect(isRealString(45)).toBe(false);
        });

        it('should reject string with spaces', () => {
            expect(isRealString('     ')).toBe(false);
        });

        it('should allow strings with non special characters', () => {
            expect(isRealString('  good   ')).toBe(true);
        });
    });
});