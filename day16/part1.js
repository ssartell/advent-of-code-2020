import R from 'ramda';

const debug = x => { debugger; return x; };

const fieldsRegex = /(.*): (\d*)-(\d*) or (\d*)-(\d*)/;
const readField = R.pipe(R.match(fieldsRegex), R.tail, R.zipObj(['field', 'a', 'b', 'c', 'd']), R.evolve({a: parseInt, b: parseInt, c: parseInt, d: parseInt}));
const readFields = R.pipe(R.split('\n'), R.map(readField));
const readTicket = R.pipe(R.split(','), R.map(parseInt));
const readMyTicket = R.pipe(R.split('\n'), R.nth(1), readTicket);
const readNearbyTickets = R.pipe(R.split('\n'), R.tail, R.map(readTicket));
const parseInput = R.pipe(R.split('\n\n'), R.zipObj(['fields', 'myTicket', 'nearbyTickets']), R.evolve({fields: readFields, myTicket: readMyTicket, nearbyTickets: readNearbyTickets}));

const isBetween = R.curry((a, b, x) => a <= x && x <= b);
const isValid = R.curry((value, rule) => isBetween(rule.a, rule.b, value) || isBetween(rule.c, rule.d, value));
const anyIsValid = R.curry((rules, value) => R.any(isValid(value), rules));

const findInvalid = input => R.filter(R.pipe(anyIsValid(input.fields), R.not), R.flatten(input.nearbyTickets));

export default R.pipe(parseInput, findInvalid, R.sum);