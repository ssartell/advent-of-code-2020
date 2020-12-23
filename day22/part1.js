import R from 'ramda';

const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.split('\n\n'), R.map(R.pipe(R.split('\n'), R.tail, R.map(parseInt))));

const hasWinner = R.any(x => x.length === 0);
const playGame = decks => {
    while(!hasWinner(decks)) {
        let a = decks[0].shift();
        let b = decks[1].shift();
        if (a > b) {
            decks[0].push(a);
            decks[0].push(b);
        } else {
            decks[1].push(b);
            decks[1].push(a);
        }
    }

    return decks[0].length > 0 ? decks[0] : decks[1];
}

export default R.pipe(parseInput, playGame, R.reverse, R.addIndex(R.map)((x, i) => x * (i + 1)), R.sum);