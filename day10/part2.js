import R from 'ramda';

const max = R.reduce(R.max, -Infinity);
const parseInput = R.pipe(R.split('\n'), R.map(parseInt), x => x.concat([0, max(x) + 3]), R.sortBy(R.identity));

const countCombos = R.memoizeWith(R.identity, R.curry((i, list) => {
    if (i === list.length - 1) return 1;
    
    let combos = 0;
    for(var j = i + 1; j < R.min(i + 4, list.length); j++) {
        if (list[i] + 3 >= list[j]) 
            combos += countCombos(j, list);
    }
    return combos;
}));

export default R.pipe(parseInput, countCombos(0));