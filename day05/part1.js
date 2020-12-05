import R from 'ramda';

const debug = x => { debugger; return x; };

export const readLine = R.pipe(R.replace(/[FL]/g, '0'), R.replace(/[BR]/g, '1'), R.splitAt(7), R.map(x => parseInt(x, 2)), x => x[0] * 8 + x[1]);
const parseInput = R.pipe(R.trim, R.split('\r\n'), R.map(readLine));
const max = R.reduce(R.max, -Infinity);

export default R.pipe(parseInput, max);