import R from 'ramda';

const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.split('\n'), R.map(R.split('')));

const getNeighbors = (x, y, layout) => {
    let neighbors = [];
    for(let j = y - 1; j <= y + 1; j++) {
        for(let i = x - 1; i <= x + 1; i++) {
            if (j === y && i === x) continue;
            if (j < 0 || layout.length <= j) continue;
            if (i < 0 || layout[0].length <= i) continue;
            neighbors.push(layout[j][i]);
        }
    }
    return neighbors;
}

const filledSeatCount = R.pipe(R.filter(x => x === '#'), R.length);
const seatIsEmpty = seat => seat === 'L';
const seatIsOccupied = seat => seat === '#';
const countOccupiedSeats = R.pipe(R.flatten, R.filter(seatIsOccupied), R.length);

const tick = layout => {
    let changes = false;
    let newLayout = [];
    for(let y = 0; y < layout.length; y++) {
        let row = [];
        for(let x = 0; x < layout[0].length; x++) {
            let seat = layout[y][x];
            let neighbors = getNeighbors(x, y, layout);
            let occupiedAdjacentSeats = filledSeatCount(neighbors);
            if (seatIsEmpty(seat) && occupiedAdjacentSeats === 0) {
                row.push('#');
                changes = true;
            } else if (seatIsOccupied(seat) && occupiedAdjacentSeats >= 4) {
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