import R from 'ramda';

const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.split('\n'), R.map(R.split('')));

const filledSeatCount = R.pipe(R.filter(x => x === '#'), R.length);
const seatIsEmpty = seat => seat === 'L';
const seatIsOccupied = seat => seat === '#';
const isFloor = seat => seat === '.';
const countOccupiedSeats = R.pipe(R.flatten, R.filter(seatIsOccupied), R.length);
const isInBounds = (x, y, layout) => 0 <= x && x < layout[0].length && 0 <= y && y < layout.length;

const getVisibleSeats = (x, y, layout) => {
    let neighbors = [];
    let pos = [x, y];
    for(let dy = -1; dy <= 1; dy++) {
        for(let dx = -1; dx <= 1; dx++) {
            if (dy === 0 && dx === 0) continue;

            let [i, j] = [x + dx, y + dy];
            while(isInBounds(i, j, layout) && isFloor(layout[j][i])) {
                i += dx;
                j += dy;
            }
            
            if (isInBounds(i, j, layout))           
                neighbors.push(layout[j][i]);
        }
    }
    return neighbors;
}

const tick = layout => {
    let changes = false;
    let newLayout = [];
    for(let y = 0; y < layout.length; y++) {
        let row = [];
        for(let x = 0; x < layout[0].length; x++) {
            let seat = layout[y][x];
            let neighbors = getVisibleSeats(x, y, layout);
            let occupiedAdjacentSeats = filledSeatCount(neighbors);
            if (seatIsEmpty(seat) && occupiedAdjacentSeats === 0) {
                row.push('#');
                changes = true;
            } else if (seatIsOccupied(seat) && occupiedAdjacentSeats >= 5) {
                row.push('L');
                changes = true;
            } else {
                row.push(seat);
            }
        }
        newLayout.push(row);
    }
    
    return changes ? newLayout : layout;
};

const run = init => {
    let layout = init;
    let newLayout = null;
    while(true) {
        newLayout = tick(layout);
        if (newLayout === layout) break;
        layout = newLayout;
    }

    return countOccupiedSeats(layout);
}

export default R.pipe(parseInput, run);