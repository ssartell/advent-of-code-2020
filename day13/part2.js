import R from 'ramda';

const tryParseInt = x => isNaN(parseInt(x)) ? x : parseInt(x);
const parseInput = R.pipe(R.split('\n'), R.nth(1), R.split(','), R.map(tryParseInt));

const mapIndexed = R.addIndex(R.map);
const findStart = buses => {
    let t = 0;
    let cycle = buses[0].id;
    for(let i = 1; i < buses.length; i++) {
        let bus = buses[i];
        while((t + bus.i) % bus.id !== 0)
            t += cycle;
        cycle *= bus.id;
    }
    return t;
}

export default R.pipe(parseInput, mapIndexed((id, i) => ({id, i})), R.filter(x => x.id !== 'x'), findStart);