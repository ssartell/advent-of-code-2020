import R from 'ramda';

const debug = x => { debugger; return x; };

const lineMatch = /(\d*)-(\d*) (\S): (\S*)/;
const parseLine = R.pipe(R.match(lineMatch), R.tail, R.zipObj(['min', 'max', 'letter', 'password']), R.evolve({'min': parseInt, 'max': parseInt}));
const parseInput = R.pipe(R.trim, R.split('\n'), R.map(parseLine));

const isBetween = (min, max, x) => (min <= x) && (x <= max);
const isValid = entry => isBetween(entry.min, entry.max, entry.password.split('').filter(x => x === entry.letter).length);

export default R.pipe(parseInput, R.filter(isValid), R.length);