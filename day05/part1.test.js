import assert from 'assert';
import part1, { readLine } from './part1.js';

describe('day05', function() {
    describe('part1', function() {
        it('readLine', function() {
            assert.equal(readLine("FBFBBFFRLR"), 357);
        });
    });
});