import R from 'ramda';
import combinations from '../utils/combinations.js';

const parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseInt));

const findCombo = R.curry((sum, list) => {
    for (const combo of combinations(list, 3)) {
        if (R.sum(combo) === 2020) 
            return R.product(combo);
    }
});

export default R.pipe(parseInput, findCombo(2020));