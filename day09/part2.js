import R, { set } from 'ramda';
import { firstInvalidXmas } from './part1.js';

const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.split('\n'), R.map(parseInt));

const min = R.reduce(R.min, Infinity);
const max = R.reduce(R.max, -Infinity);

const findWeakness = data => {
    let num = firstInvalidXmas(25, data);
    
    for(let i = 0; i < data.length - 1; i++) {
        for(let j = i + 1; j < data.length; j++) {
            let slice = R.slice(i, j + 1, data);
            let sum = R.sum(slice);
            if (sum === num) return min(slice) + max(slice);
        }
    }
}

export default R.pipe(parseInput, findWeakness);