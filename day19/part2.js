import R from 'ramda';

const debug = x => { debugger; return x; };

const tryParseInt = x => isNaN(parseInt(x)) ? x : parseInt(x);
const ruleRegex = /(\d*): (?:(?:"(.*)")|(.*))/;
const parseIds = x => x && x.split(' | ').map(y => y.split(' '));
const parseRule = R.pipe(R.match(ruleRegex), R.tail, R.zipObj(['id', 'letter', 'groups']), R.evolve({ groups: parseIds }));
const toMap = R.reduce((map, rule) => map.set(rule.id, rule), new Map());
const parseRules = R.pipe(R.split('\n'), R.map(parseRule), toMap);
const parseMessages = R.pipe(R.split('\n'));
const parseInput = R.pipe(R.split('\n\n'), R.zipObj(['rules', 'messages']), R.evolve({rules: parseRules, messages: parseMessages}));

const match = (rules, id, message) => {
    if (message === '') return [];
    
    const rule = rules.get(id);

    if (rule.letter) {
        return message.startsWith(rule.letter) ? [message.substr(1)] : [];
    }

    let allFragments = [];
    for(let group of rule.groups) {
        let fragments = [message];
        for(let subId of group) {
            let nextFragments = [];
            for(let fragment of fragments) {
                nextFragments = nextFragments.concat(match(rules, subId, fragment));
            }
            fragments = nextFragments;
            if (fragments.length === 0) break;
        }
        allFragments = allFragments.concat(fragments);
    }
    return allFragments;
};

const meetsRules = input => R.filter(x => R.any(x => x === '', match(input.rules, '0', x)), input.messages);

const fixRules = input => {
    input.rules.set("8", { groups: [['42'], ['42', '8']] });
    input.rules.set("11", { groups: [['42', '31'], ['42', '11', '31']] });
    return input;
}

export default R.pipe(parseInput, fixRules, meetsRules, R.length);