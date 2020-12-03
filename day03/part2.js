import R from 'ramda';

const parseInput = R.pipe(R.trim, R.split('\n'), R.map(R.split('')));

const slopes = [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 5, y: 1 }, { x: 7, y: 1 }, { x: 1, y: 2 }];
const step = (pos, slope) => ({ x: pos.x + slope.x, y: pos.y + slope.y });
const isTree = (map, dims, pos) => map[pos.y][pos.x % dims.w] === '#';
const getDimensions = (map) => ({ h: map.length - 1, w: map[0].length - 1 });

const run = R.curry((map, slope) => {
    let pos = { x: 0, y: 0 };
    let dims = getDimensions(map);
    let trees = 0;
    while (pos.y < dims.h) {
        pos = step(pos, slope);
        trees += isTree(map, dims, pos) ? 1 : 0;
    }

    return trees;
});

export default R.pipe(parseInput, run, R.map(R.__, slopes), R.product);