import R from 'ramda';

const debug = x => { debugger; return x; };

const readLine = R.pipe(R.trim, R.split(/\s+/), R.map(R.split(':')), R.fromPairs);
const parseInput = R.pipe(R.trim, R.split('\r\n\r\n'), R.map(readLine));

const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
const isValid = R.pipe(R.keys, R.without(R.__, requiredFields), R.length, R.equals(0));

export default R.pipe(parseInput, R.filter(isValid), R.length);