import assert from 'assert';
import part2, { isValid } from './part2.js';

describe('day02', function() {
    describe('part2', function() {
        it('isValid1', function() {
            assert.equal(isValid({min: 1, max: 3, letter: 'a', password: 'abcde'}), true);
        });
        it('isValid1', function() {
            assert.equal(isValid({min: 1, max: 3, letter: 'b', password: 'cdefg'}), false);
        });
        it('isValid1', function() {
            assert.equal(isValid({min: 2, max: 9, letter: 'c', password: 'ccccccccc'}), false);
        });
    });
});