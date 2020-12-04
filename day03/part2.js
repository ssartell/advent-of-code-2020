import R from 'ramda';

const parseInput = R.pipe(R.split('\n'), R.map(R.pipe(R.trim, R.split(''))));

const slopes = [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 5, y: 1 }, { x: 7, y: 1 }, { x: 1, y: 2 }];
const step = (pos, slope) => ({ x: pos.x + slope.x, y: pos.y + slope.y });
const isTree = (map, dims, pos) => map[pos.y][pos.x % dims.w] === '#';
const getDimensions = (map) => ({ h: map.length, w: map[0].length });

const run = R.curry((map, slope) => {
    let pos = { x: 0, y: 0 };
    let dims = getDimensions(map);
    //return R.flatten(map).filter((x, i) => Math.floor(i / dims.w) / slope.y * slope.x % dims.w === i % dims.w && x === '#').length;
    let trees = 0;
    while (pos.y < dims.h - 1) {
        pos = step(pos, slope);
        trees += isTree(map, dims, pos) ? 1 : 0;
    }

    return trees;
});

export default R.pipe(parseInput, run, R.map(R.__, slopes), R.product);

// import R from 'ramda';
// export default R.pipe(R.pipe(R.split('\n'), R.map(R.pipe(R.trim, R.split('')))), R.curry((map, s) => R.flatten(map).filter((x, i) => Math.floor(i / map[0].length) / s[1] * s[0] % map[0].length === i % map[0].length)), R.map(R.__, [[1,1], [3,1], [5,1], [7,1], [1,2]]), R.map(R.pipe(R.filter(x => x === '#'), R.length)), R.product);