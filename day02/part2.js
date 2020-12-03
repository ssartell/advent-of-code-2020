import R from 'ramda';

const lineMatch = /(\d*)-(\d*) (\S): (\S*)/;
const parseLine = R.pipe(R.match(lineMatch), R.tail, R.zipObj(['min', 'max', 'letter', 'password']), R.evolve({'min': parseInt, 'max': parseInt}));
const parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

export const isValid = x => (x.password.substr(x.min - 1, 1) === x.letter) ^ (x.password.substr(x.max - 1, 1) === x.letter)

export default R.pipe(parseInput, R.filter(isValid), R.length);

//export default R.pipe(R.trim, R.split('\n'), R.map(R.pipe(R.match(/(\d*)-(\d*) (\S): (\S*)/), R.tail)), R.filter(x => (x[3].substr(parseInt(x[0]) - 1, 1) === x[2]) ^ (x[3].substr(parseInt(x[1]) - 1, 1) === x[2])), R.length);