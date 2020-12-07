import R from 'ramda';

const lineRegex = /(\w+ \w+) bags contain (?:(?:no other bags)|((?:\d+ \w+ \w+ bags?,? ?)+))./;
const contentsRegex = /(\d+) (\w+ \w+) bags?/;
const readRule = R.pipe(R.match(contentsRegex), R.tail, R.zipObj(['count', 'color']), R.evolve({'count': parseInt}));
const readContents = R.pipe(R.split(', '), R.map(readRule));
const readLine = R.pipe(R.match(lineRegex), R.tail, R.zipObj(['color', 'contents']), R.evolve({'contents': x => x ? readContents(x) : [] }));
const parseInput = R.pipe(R.split('\n'), R.map(readLine));

const canContainColor = R.curry((color, bags, bag) => bag.color !== color && bag.contents.some(x => x.color === color || canContainColor(color, bags, bags.find(y => y.color === x.color))));
const bagsThatCanContain = R.curry((color, bags) => bags.filter(canContainColor(color, bags)));

export default R.pipe(parseInput, bagsThatCanContain('shiny gold'), R.length);