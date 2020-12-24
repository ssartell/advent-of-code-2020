import R from 'ramda';

const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.split('\n\n'), R.map(R.pipe(R.split('\n'), R.tail, R.map(parseInt))));

const key = (a, b) => `${a.join(',')}+${b.join(',')}`;
const hasWinner = R.any(x => x.length === 0);
const playGame = ([deck1, deck2]) => {
    const prevRounds = new Set();

    while(!hasWinner([deck1, deck2])) {
        let roundKey = key(deck1, deck2);
        if (prevRounds.has(roundKey)) {
            return [[10], []];
        } else {
            prevRounds.add(roundKey);
        }

        let card1 = deck1.shift();
        let card2 = deck2.shift();
        let player1Wins = false;
        if (card1 <= deck1.length && card2 <= deck2.length){
            let [subDeck1, subDeck2] = playGame([R.take(card1, deck1), R.take(card2, deck2)]);
            if (subDeck1.length > subDeck2.length) {
                deck1.push(card1);
                deck1.push(card2);
            } else {
                deck2.push(card2);
                deck2.push(card1);
            }
        } else if (card1 > card2) {
            deck1.push(card1);
            deck1.push(card2);
        } else {
            deck2.push(card2);
            deck2.push(card1);
        }
    }

    return [deck1, deck2];
}

export default R.pipe(parseInput, playGame, ([deck1, deck2]) => deck1.length > 0 ? deck1 : deck2, R.reverse, R.addIndex(R.map)((x, i) => x * (i + 1)), R.sum);