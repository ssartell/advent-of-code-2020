import R from 'ramda';

const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.trim, R.split('\n'), R.map(R.split('')));

const step = (pos, width) => ({ x: (pos.x + 3) % width, y: pos.y + 1 });
const isTree = (map, pos) => map[pos.y][pos.x] === '#';

const run = map => {
    let pos = {x:0, y:0};
    let height = map.length - 1;
    let width = map[0].length - 1;
    let trees = 0;
    while (pos.y < height) {
        pos = step(pos, width);
        trees += isTree(map, pos) ? 1 : 0;
    }

    return trees;
}

export default R.pipe(parseInput, run);