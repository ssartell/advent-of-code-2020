import R from 'ramda';

const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.split('\n'));

const dirs = {
    'nw': [0, 1, -1],
    'ne': [1, 0, -1],
    'e':  [1, -1, 0],
    'se': [0, -1, 1],
    'sw': [-1, 0, 1],
    'w':  [-1, 1, 0]
}

const tileKey = ([x, y, z]) => `${x},${y},${z}`;
const add = (a, b) => R.zipWith(R.add, a, b);
const flipTile = (tiles, input) => {
    let pos = [0, 0, 0];
    for(let i = 0; i < input.length; i++) {
        let dir = input.substr(i, 2);
        if (!R.has(dir, dirs)) {
            dir = input.substr(i, 1);
        }

        pos = add(pos, dirs[dir]);
        i += dir.length;
    }

    let key = tileKey(x, y, z);
    if (tiles.has(tileKey)) {
        let color = (tiles.get(tileKey) + 1) % 2;
        tiles.set(tileKey, color);
    } else {
        tiles.set(tileKey, 1);
    }

    return tiles;
};

const run = tiles => {

}

export default R.pipe(parseInput, R.reduce(flipTile, new Map()), run);