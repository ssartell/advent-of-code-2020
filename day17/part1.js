import R, { dec, set } from 'ramda';

const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.split('\n'));

const key = ([x, y, z]) => `${x},${y},${z}`;
const getDimensions = input => [input.length - 1, input[0].length - 1, 0];

const toState = input => {
    let state = new Set();
    let [maxX, maxY] = getDimensions(input);
    let z = 0;
    for(let y = 0; y <= maxY; y++) {
        for(let x = 0; x <= maxX; x++) {
            if (input[y][x] === '#')
                state.add(key([x, y, z]));
        }
    }
    return state;
}

const getCube = function* ([x1, y1, z1], [x2, y2, z2]) {
    for(let z = z1; z <= z2; z++) {
        for(let y = y1; y <= y2; y++) {
            for(let x = x1; x <= x2; x++) {
                yield [x, y, z];
            }
        }    
    }
}

const print = ([x1, y1, z1], [x2, y2, z2], state) => {
    for(let z = z1; z <= z2; z++) {
        console.log(`z=${z}`);
        for(let y = y1; y <= y2; y++) {
            let row = '';
            for(let x = x1; x <= x2; x++) {
                row += state.has(key([x, y, z])) ? '#' : '.';
            }
            console.log(row);
        }
        console.log('\n');
    }
};

const decAll = R.map(R.dec);
const incAll = R.map(R.inc);
const allEqual = R.pipe(R.zip, R.all(R.apply(R.equals)));

const run = input => {
    let min = [0, 0, 0];
    let max = getDimensions(input);
    let state = toState(input);

    for(let t = 0; t < 6; t++) {
        //print(min, max, state);
        let newState = new Set();
        min = decAll(min);
        max = incAll(max);
        for(let cell of getCube(min, max)) {
            let active = state.has(key(cell));
            let sum = 0;
            for(let neighbor of getCube(decAll(cell), incAll(cell))) {
                if (allEqual(cell, neighbor)) continue;
                if (state.has(key(neighbor))) sum++;
                if (active && sum > 3) break;
            }
            if ((active && (sum === 2 || sum === 3)) || (!active && sum === 3)) {
                newState.add(key(cell));
            }
        }
        state = newState;
    }
    return state.size;
}

export default R.pipe(parseInput, run);