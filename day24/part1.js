import R from 'ramda';

const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.split('\n'));

const flipTile = (tiles, input) => {
    let [x, y, z] = [0, 0, 0];
    for(let i = 0; i < input.length; i++) {
        let dir = input.substr(i, 2);
        if (dir === 'nw') {
            y++; 
            z--;
            i++;
            continue;
        } else if (dir === 'ne') {
            x++;
            z--;
            i++;
            continue;
        } else if (dir === 'sw') {
            x--;
            z++;
            i++;
            continue;
        } else if (dir === 'se') {
            y--;
            z++;
            i++;
            continue;
        }
        
        dir = input.substr(i, 1);
        if (dir === 'w') {
            x--;
            y++;
            continue;
        } else if (dir === 'e') {
            x++;
            y--;
            continue;
        }
    }

    let tileKey = `${x},${y},${z}`;
    if (tiles.has(tileKey)) {
        let color = (tiles.get(tileKey) + 1) % 2;
        tiles.set(tileKey, color);
    } else {
        tiles.set(tileKey, 1);
    }

    return tiles;
}

export default R.pipe(parseInput, R.reduce(flipTile, new Map()), x => Array.from(x.values()), R.sum);