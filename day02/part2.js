import R from 'ramda';

const debug = x => { debugger; return x; };

const lineMatch = /(\d*)-(\d*) (\S): (\S*)/;
const parseLine = R.pipe(R.match(lineMatch), R.tail, R.zipObj(['min', 'max', 'letter', 'password']), R.evolve({'min': parseInt, 'max': parseInt}));
const parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

export const isValid = entry => entry.password.substr(entry.min - 1, 1) === entry.letter ^ entry.password.substr(entry.max - 1, 1) === entry.letter

export default R.pipe(parseInput, R.filter(isValid), R.length);