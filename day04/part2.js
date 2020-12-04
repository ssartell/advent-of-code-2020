import R from 'ramda';

const readLine = R.pipe(R.trim, R.split(/\s+/), R.map(R.split(':')), R.fromPairs);
const parseInput = R.pipe(R.trim, R.split('\r\n\r\n'), R.map(readLine));

const fourDigits = /^\d{4}$/;
const nineDigits = /^\d{9}$/;
const hexColor = /^#([a-f]|[0-9]){6}$/;
const height = /^(\d+)((?:cm)|(?:in))$/;

const hasFields = fields => R.pipe(R.keys, R.without(R.__, fields), R.length, R.equals(0));
const allFieldsValid = rules => R.pipe(R.evolve(rules), R.values, R.all(R.identity));
const isMatch = R.curry((regex, str) => regex.test(str));
const isBetween = R.curry((min, max, x) => min <= x && x <= max);
const toHeight = R.pipe(R.match(height), R.tail, R.zipObj(['height', 'unit']));
const isValidCm = R.pipe(toHeight, allFieldsValid({'unit': R.equals('cm'), 'height': isBetween(150, 193)}));
const isValidIn = R.pipe(toHeight, allFieldsValid({'unit': R.equals('in'), 'height': isBetween(59, 76)}));
const isFoundIn = R.flip(R.contains);

const validationRules = {
    'byr': R.allPass([isMatch(fourDigits), isBetween(1920, 2002)]),
    'iyr': R.allPass([isMatch(fourDigits), isBetween(2010, 2020)]),
    'eyr': R.allPass([isMatch(fourDigits), isBetween(2020, 2030)]),
    'hgt': R.allPass([isMatch(height), R.anyPass([isValidCm, isValidIn])]),
    'hcl': R.allPass([isMatch(hexColor)]),
    'ecl': R.allPass([isFoundIn(['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'])]),
    'pid': R.allPass([isMatch(nineDigits)]),
};

const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

export default R.pipe(parseInput, R.filter(R.allPass([hasFields(requiredFields), allFieldsValid(validationRules)])), R.length);