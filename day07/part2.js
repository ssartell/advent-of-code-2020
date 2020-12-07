import R from 'ramda';

const lineRegex = /(\w+ \w+) bags contain (?:(?:no other bags)|((?:\d+ \w+ \w+ bags?,? ?)+))./;
const contentsRegex = /(\d+) (\w+ \w+) bags?/;
const readRule = R.pipe(R.match(contentsRegex), R.tail, R.zipObj(['count', 'color']), R.evolve({'count': parseInt}));
const readContents = R.pipe(R.split(', '), R.map(readRule));
const readLine = R.pipe(R.match(lineRegex), R.tail, R.zipObj(['color', 'contents']), R.evolve({'contents': x => x ? readContents(x) : [] }));
const parseInput = R.pipe(R.split('\n'), R.map(readLine));

const bagsIn = R.curry((color, bags) => {
    let bag = bags.find(x => x.color === color);
    return R.sum(R.map(x => x.count * (1 + bagsIn(x.color, bags)), bag.contents));
})

export default R.pipe(parseInput, bagsIn('shiny gold'));