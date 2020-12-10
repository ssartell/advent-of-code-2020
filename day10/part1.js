import R from 'ramda';

const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.split('\n'), R.map(parseInt));
const diffs = R.pipe(R.aperture(2), R.map(x => x[1] - x[0]));
const sum = n => R.pipe(R.filter(R.equals(n)), R.length);
const final = R.converge(R.multiply, [sum(1), R.pipe(sum(3), R.add(1))]);

export default R.pipe(parseInput, R.prepend(0), R.sortBy(R.identity), diffs, final);