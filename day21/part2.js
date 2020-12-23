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
    let badMap = new Map();
    for(let allergen of map.keys()) {
        badMap.set(allergen, map.get(allergen).reduce(R.intersection));
    }

    while(R.any(x => x.length > 1, Array.from(badMap.values()))) {
        for(let allergen of badMap.keys()) {
            let bad = badMap.get(allergen);
            if (badMap.get(allergen).length === 1) {
                let single = bad[0];
                for(let otherAllergen of badMap.keys()) {
                    if (otherAllergen === allergen) continue;
                    let otherList = badMap.get(otherAllergen);
                    badMap.set(otherAllergen, R.without([single], otherList));
                }
            }
        }
    }

    return R.sortBy(R.identity, Array.from(badMap.keys())).map(allergen => badMap.get(allergen)[0]).join(',');
}

export default R.pipe(parseInput, findSafeFoods);