import R from 'ramda';

const debug = x => { debugger; return x; };

const foodRegex = /(.*) \(contains (.*)\)/;
const parseFood = R.pipe(R.match(foodRegex), R.tail, R.zipObj(['ingredients', 'allergens']), R.evolve({ingredients: R.split(' '), allergens: R.split(', ')}));
const parseInput = R.pipe(R.split('\n'), R.map(parseFood));

const combine = R.reduce((map, food) => {
    for(let allergen of food.allergens) {
        if (!map.has(allergen)) {
            map.set(allergen, []);
        }
        let combos = map.get(allergen);
        combos.push(food.ingredients);
    }
    return map;
}, new Map());

const findSafeFoods = input => {
    let map = combine(input);
    let all = R.map(x => x.ingredients, input).reduce(R.union);
    let bad = Array.from(map.keys()).reduce((bad, allergen) => R.union(bad, map.get(allergen).reduce(R.intersection)), []);
    let good = R.without(bad, all);
    return R.map(food => R.intersection(food.ingredients, good).length, input);
}

export default R.pipe(parseInput, findSafeFoods, R.sum);