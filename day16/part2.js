import R from 'ramda';

const debug = x => { debugger; return x; };

const ruleRegex = /(.*): (\d*)-(\d*) or (\d*)-(\d*)/;
const readRule = R.pipe(R.match(ruleRegex), R.tail, R.zipObj(['name', 'a', 'b', 'c', 'd']), R.evolve({a: parseInt, b: parseInt, c: parseInt, d: parseInt}));
const readRules = R.pipe(R.split('\n'), R.map(readRule));
const readTicket = R.pipe(R.split(','), R.map(parseInt));
const readMyTicket = R.pipe(R.split('\n'), R.nth(1), readTicket);
const readNearbyTickets = R.pipe(R.split('\n'), R.tail, R.map(readTicket));
const parseInput = R.pipe(R.split('\n\n'), R.zipObj(['rules', 'myTicket', 'nearbyTickets']), R.evolve({rules: readRules, myTicket: readMyTicket, nearbyTickets: readNearbyTickets}));

const isBetween = R.curry((a, b, x) => a <= x && x <= b);
const isValid = R.memoizeWith(
    (rule, value) => `${rule.name} ${value}`,
    R.curry((rule, value) => isBetween(rule.a, rule.b, value) || isBetween(rule.c, rule.d, value))
);

const anyRulesValid = R.curry((rules, value) => R.any(rule => isValid(rule, value), rules));
const isTicketValid = R.curry((rules, ticket) => R.all(value => anyRulesValid(rules, value), ticket));
const validTickets = input => R.filter(isTicketValid(input.rules), input.nearbyTickets);

const allValid = R.memoizeWith(
    (rule, values) => `${rule.name} ${values.join(',')}`,
    R.curry((rule, values) => R.all(isValid(rule), values))
);

const findOrder = R.memoizeWith(
    (fields, unmatched) => `${fields.length} ${unmatched.map(x => x.name).join(',')}`,
    (fields, unmatched, matched = []) => {
        if (fields.length === 0) return matched;

        let field = R.head(fields);
        let remainingFields = R.tail(fields);
        for(let rule of unmatched) {
            if (allValid(rule, field)) {
                let result = findOrder(remainingFields, R.without([rule], unmatched), [...matched, rule]);
                if (result !== null) return result;
            }
        }

        return null;
    }
);

const getResult = input => {
    let fields = R.transpose(validTickets(input));
    let order = findOrder(fields, input.rules);

    return R.product(R.map(R.nth(1), R.filter(x => x[0].name.startsWith('departure'), R.zip(order, input.myTicket))));
}

export default R.pipe(parseInput, getResult);