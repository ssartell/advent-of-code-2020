import R from 'ramda';

const lineMatch = /(\d*)-(\d*) (\S): (\S*)/;
const parseLine = R.pipe(R.match(lineMatch), R.tail, R.zipObj(['min', 'max', 'letter', 'password']), R.evolve({'min': parseInt, 'max': parseInt}));
const parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

const inRange = (min, max, x) => (min <= x) && (x <= max);
const isValid = x => inRange(x.min, x.max, x.password.split('').filter(R.equals(x.letter)).length);

export default R.pipe(parseInput, R.filter(isValid), R.length);