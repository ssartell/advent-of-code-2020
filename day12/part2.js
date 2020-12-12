import R from 'ramda';

const readLine = R.pipe(R.splitAt(1), R.zipObj(['op', 'units']), R.evolve({ units: parseInt }));
const parseInput = R.pipe(R.split('\n'), R.map(readLine));

const rads = Math.PI / 180;
const rot = (dx, dy, units) => ({
    dx: Math.round(dx * Math.cos(units * rads) - dy * Math.sin(units * rads)), 
    dy: Math.round(dx * Math.sin(units * rads) + dy * Math.cos(units * rads))
});
const ops = {
    N: ({x, y, dx, dy}, units) => ({x, y, dx, dy: dy - units}),
    E: ({x, y, dx, dy}, units) => ({x, y, dx: dx + units, dy}),
    S: ({x, y, dx, dy}, units) => ({x, y, dx, dy: dy + units}),
    W: ({x, y, dx, dy}, units) => ({x, y, dx: dx - units, dy}),
    L: ({x, y, dx, dy}, units) => ({x, y, ...rot(dx, dy, -units)}),
    R: ({x, y, dx, dy}, units) => ({x, y, ...rot(dx, dy, units)}),
    F: ({x, y, dx, dy}, units) => ({x: x + units * dx, y: y + units * dy, dx, dy}),
};

const moveFerry = R.reduce((state, x) => ops[x.op](state, x.units));
const manhattanDist = ({x, y}) => Math.abs(x) + Math.abs(y);

export default R.pipe(parseInput, moveFerry({x: 0, y: 0, dx: 10, dy: -1}), manhattanDist);