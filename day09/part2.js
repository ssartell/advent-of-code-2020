import R, { set } from 'ramda';
import { firstInvalidXmas } from './part1.js';

const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.split('\n'), R.map(parseInt));

const findWeakness = data => {
    let num = firstInvalidXmas(25, data);
    
    for(let i = 0; i < data.length - 1; i++) {
        if (data[i] > num) break;
        for(let j = i + 1; j < data.length; j++) {
            if (data[j] > num) break;
            let sum = 0;
            let min = Infinity;
            let max = -Infinity;
            for(let k = i; k <= j; k++) {
                sum += data[k];
                min = Math.min(min, data[k]);
                max = Math.max(max, data[k]);
                if (sum > num) break;
            }
            if (sum === num) return min + max;
        }
    }
}

export default R.pipe(parseInput, findWeakness);