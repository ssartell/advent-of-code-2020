import R from 'ramda';

export const readLine = R.pipe(R.replace(/[FL]/g, '0'), R.replace(/[BR]/g, '1'), x => parseInt(x, 2));
const parseInput = R.pipe(R.trim, R.split('\r\n'), R.map(readLine));

const findSeatIndex = R.pipe(R.aperture(2), R.map(x => x[1] - x[0]), R.indexOf(2));

export default R.pipe(parseInput, R.sortBy(R.identity), R.converge(R.nth, [findSeatIndex, R.identity]), R.add(1));

// import R from 'ramda';
// export default R.pipe(R.trim, R.split('\r\n'), R.map(R.pipe(R.replace(/[FL]/g, '0'), R.replace(/[BR]/g, '1'), x => parseInt(x, 2))), R.sortBy(R.identity), R.converge(R.nth, [R.pipe(R.aperture(2), R.map(x => x[1] - x[0]), R.indexOf(2)), R.identity]), R.add(1));