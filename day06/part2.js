import R from 'ramda';

const parseInput = R.pipe(R.split('\n\n'), R.map(R.split('\n')));

export default R.pipe(parseInput, R.map(R.pipe(x => x.reduce(R.intersection), R.length)), R.sum);

// import R from 'ramda';
// export default R.pipe(R.split('\n\n'), R.map(R.split('\n')), R.map(R.pipe(x => x.reduce(R.intersection), R.length)), R.sum);