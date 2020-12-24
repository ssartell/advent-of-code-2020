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

const toKey = ([x, y, z]) => `${x},${y},${z}`;
const fromKey = R.pipe(R.split(','), R.map(parseInt));
const add = R.curry((a, b) => R.zipWith(R.add, a, b));
const flipTile = (tiles, input) => {
    let pos = [0, 0, 0];
    for(let i = 0; i < input.length;) {
        let dir = input.substr(i, 2);
        dir = R.has(dir, dirs) ? dir : input.substr(i, 1);
        pos = add(pos, dirs[dir]);
        i += dir.length;
    }

    let key = toKey(pos);
    if (tiles.has(key)) {
        tiles.delete(key);
    } else {
        tiles.add(key);
    }

    return tiles;
};

const getNeighbors = pos => R.map(add(pos), R.values(dirs));

const runDay = blackTiles => {
    let next = new Set();
    let whiteTiles = new Set();
    for(let tileKey of blackTiles) {
        let pos = fromKey(tileKey);
        let neighbors = getNeighbors(pos);

        let black = 0;
        for(let neighbor of neighbors) {
            if (blackTiles.has(toKey(neighbor))) {
                black++;
            } else {
                whiteTiles.add(toKey(neighbor));
            }
        }
        if (0 < black && black <= 2) next.add(tileKey);
    }

    for(let tileKey of whiteTiles) {
        let pos = fromKey(tileKey);
        let neighbors = getNeighbors(pos);
        
        let black = 0;
        for(let neighbor of neighbors) {
            if (blackTiles.has(toKey(neighbor)))
                black++;
            if (black > 2) break;
        }
        if (black === 2) next.add(toKey(pos));
    }

    return next;
};

export default R.pipe(parseInput, R.reduce(flipTile, new Set()), R.reduce(runDay, R.__, R.range(0, 100)), x => x.size);