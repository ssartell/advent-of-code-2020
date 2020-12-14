import R from 'ramda';

const debug = x => { debugger; return x; };

const readBuses = R.pipe(R.split(','), R.filter(x => x !== 'x'), R.map(parseInt));
const parseInput = R.pipe(R.split('\n'), R.zipObj(['time', 'buses']), R.evolve({time: parseInt, buses: readBuses}));

const closest = input => {
    let minWait = Infinity;
    let result;
    for (const bus of input.buses) {
        let wait = bus - input.time % bus;
        if (wait < minWait) {
            minWait = wait;
            result = bus * minWait;
        }
    }
    return result;
}

export default R.pipe(parseInput, closest);