import R from 'ramda';

const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.trim);

export default R.pipe(parseInput, debug);