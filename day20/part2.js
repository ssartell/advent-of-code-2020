import R from 'ramda';
import Queue from 'mnemonist/queue.js';
import fs from 'fs';

const debug = x => { debugger; return x; };

const tileRegex = /Tile (\d*):\n([#.\n]*)/;
const readTile = R.pipe(R.match(tileRegex), R.tail, R.zipObj(['id', 'image']), R.evolve({id: parseInt, image: R.split('\n')}));
const parseInput = R.pipe(R.trim, R.split('\n\n'), R.map(readTile));

const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const aligns = [
    (tile, neighbor) => tile.getTop() === neighbor.getBottom(),
    (tile, neighbor) => tile.getRight() === neighbor.getLeft(),
    (tile, neighbor) => tile.getBottom() === neighbor.getTop(),
    (tile, neighbor) => tile.getLeft() === neighbor.getRight(),
];
const key = (x, y) => `${x},${y}`;
const oddTile = (x, y) => (Math.abs(x + y) % 2 + 2) % 2;

const mergeTiles = (left, right) => R.zip(left, right).map(([a, b]) => a + b);
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
                let tileAligns = false;

                for(let i = 0; i < dirs.length; i++) {
                    let [dx, dy] = dirs[i];
                    let neighbor = layout.get(key(x + dx, y + dy));
                    if (!neighbor) continue;
                    
                    for(let j = 0; j < 4; j++) {
                        if (aligns[i](tile, neighbor)) {
                            tileAligns = true;
                            break;
                        }
                        tile.flipRotate();
                        if (aligns[i](tile, neighbor)) {
                            tileAligns = true;
                            break;
                        }
                        tile.flip();
                    }
                    if (tileAligns) break;
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

    for(let tile of tiles) {
        tile.trim();
    }

    let finalImage = [];
    for(let y = minY; y <= maxY; y++) {
        let row = layout.get(key(minX, y)).image;
        for(let x = minX + 1; x <= maxX; x++) {
            let tileKey = key(x, y);
            let tile = layout.get(tileKey);
            row = mergeTiles(row, tile.image);
        }
        finalImage = R.concat(finalImage, row);
    }

    return finalImage;
}

const trimEdges = R.pipe(R.tail, R.init);
const flipImage = R.reverse;
const flipRotateImage = R.pipe(R.transpose, R.map(x => x.join('')));
const prepTiles = R.map(tile => {
    tile.getTop = () => R.head(tile.image);
    tile.getBottom = () => R.last(tile.image);
    tile.getRight = () => R.map(R.last, tile.image).join('');
    tile.getLeft = () => R.map(R.head, tile.image).join('');

    tile.flipRotate = () => {
        tile.image = flipRotateImage(tile.image);
    };
    tile.flip = () => {
        tile.image = flipImage(tile.image);
    };
    tile.trim = () => {
        tile.image = trimEdges(tile.image).map(trimEdges);
    };

    return tile;
});

const countChars = image => R.match(/#/g, image).length;
const matchAll = (reg, str) => Array.from(str.matchAll(reg), x => x[1]);
const seaMonster = fs.readFileSync('./day20/seaMonster.txt', 'utf8');
const findSeaMonsters = finalImage => {
    let width = finalImage[0].length;
    let height = finalImage.length;

    let seaMonsterWidth = seaMonster.indexOf('\n');
    let seaMonsterRegex = new RegExp(`(?=(${seaMonster.replace(/\n/g, `.{${width - seaMonsterWidth}}`).replace(/\s/g, '.')}))`, 'g');

    let image = '';
    let matches = [];
    for(let i = 0; i < 4; i++) {
        image = finalImage.join('');
        matches = matchAll(seaMonsterRegex, image);
        if (matches.length > 0) break;
        finalImage = flipRotateImage(finalImage);
        image = finalImage.join('');
        matches = matchAll(seaMonsterRegex, image);
        if (matches.length > 0) break;
        finalImage = flipImage(finalImage);
    }

    // for(let i = 0; i < finalImage.length; i++) {
    //     console.log(finalImage[i]);
    // }

    return countChars(image) - matches.length * countChars(seaMonster);
}

export default R.pipe(parseInput, prepTiles, reassemble, findSeaMonsters);