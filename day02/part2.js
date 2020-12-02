import R from 'ramda';

const lineMatch = /(\d*)-(\d*) (\S): (\S*)/;
const parseLine = R.pipe(R.match(lineMatch), R.tail, R.zipObj(['min', 'max', 'letter', 'password']), R.evolve({'min': parseInt, 'max': parseInt}));
const parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

export const isValid = x => (x.password.substr(x.min - 1, 1) === x.letter) ^ (x.password.substr(x.max - 1, 1) === x.letter)

export default R.pipe(parseInput, R.filter(isValid), R.length);