import R from 'ramda';
import Queue from 'mnemonist/queue.js';

const debug = x => { debugger; return x; };

const tileRegex = /Tile (\d*):\n([#.\n]*)/;
const readTile = R.pipe(R.match(tileRegex), R.tail, R.zipObj(['id', 'image']), R.evolve({id: parseInt, image: R.split('\n')}));
const parseInput = R.pipe(R.trim, R.split('\n\n'), R.map(readTile));

const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const key = (x, y) => `${x},${y}`;
const oddTile = (x, y) => (Math.abs(x + y) % 2 + 2) % 2;

const reassemble = tiles => {
    let q = new Queue();
    q.enqueue([0, 0]);
    let layout = new Map();
    let freeTiles = tiles;
    let [minX, minY] = [0, 0];
    let [maxX, maxY] = [0, 0];

    while(q.peek() && freeTiles.length > 0) {
        let [x, y] = q.dequeue();
        let tileKey = key(x, y);
        let tilePlaced = false;

        if (layout.size > 0) {
            for(let tile of freeTiles) {
                let tileAligns;
                for(let a = 0; a < tile.rotations.length; a++) {
                    // let rotation = tile.rotations[(a + 4) % 8];
                    let rotation = tile.rotations[a];
                    tileAligns = true;
                    for(let i = 0; i < 4; i++) {
                        let [dx, dy] = dirs[i];
                        let neighbor = layout.get(key(x + dx, y + dy));
                        if (!neighbor) continue;
                        if (!neighbor.doTilesAlign(tile, a, i)) {
                            tileAligns = false;
                            break;
                        }
                    }
                    if (tileAligns) {
                        tile.setRetation(a);
                        break;
                    }
                }
                if (tileAligns) {
                    layout.set(tileKey, tile);
                    freeTiles = R.without([tile], freeTiles);
                    tilePlaced = true;
                    break;
                }
            }
        } else {
            let tile = R.head(freeTiles);
            tile.setRetation(0);
            layout.set(tileKey, tile);
            freeTiles = R.without([tile], freeTiles);
            tilePlaced = true;
        }
        
        if (tilePlaced) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);

            for(let [dx, dy] of dirs) {
                if (!layout.has(key(x + dx, y + dy))) {
                    q.enqueue([x + dx, y + dy]);
                }
            }
        }        
    }

    return layout.get(key(minX, minY)).id
        * layout.get(key(minX, maxY)).id
        * layout.get(key(maxX, maxY)).id
        * layout.get(key(maxX, minY)).id;
}

const toBinary = edge => parseInt(edge.replace(/\./g, '0').replace(/#/g, '1'), 2);
const rotate = R.curry((x, edges) => R.converge(R.concat, [R.drop(x), R.take(x)])(edges));
const prepTiles = R.map(tile => {
    let top = R.head(tile.image);
    let right = R.map(R.last, tile.image).join('');
    let bottom = R.reverse(R.last(tile.image));
    let left = R.reverse(R.map(R.head, tile.image)).join('');

    let normal =         [top, right, bottom, left].map(toBinary);
    let flipped =        [top, left, bottom, right].map(R.pipe(R.reverse, toBinary));
    let inverseNorm =    [bottom, left, top, right].map(R.pipe(R.reverse, toBinary));
    let inverseFlipped = [bottom, right, top, left].map(toBinary);

    tile.rotations = [
        normal, rotate(1, normal), rotate(2, normal), rotate(3, normal),
        flipped, rotate(1, flipped), rotate(2, flipped), rotate(3, flipped),
    ];
    tile.inverseRotations = [
        inverseNorm, rotate(1, inverseNorm), rotate(2, inverseNorm), rotate(3, inverseNorm),
        inverseFlipped, rotate(1, inverseFlipped), rotate(2, inverseFlipped), rotate(3, inverseFlipped),
    ];

    tile.doTilesAlign = (tile2, a, i) => tile2.rotations[a][i] === tile.inverseRotations[tile.rotation][i];
    tile.setRetation = x => tile.rotation = x;

    return tile;
})

export default R.pipe(parseInput, prepTiles, reassemble);