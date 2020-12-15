import R from 'ramda';

const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.split(','), R.map(parseInt));

const run = R.curry((nth, nums) => {
    const spoken1 = new Map();
    const spoken2 = new Map();
    let lastSpoken;
    for(let i = 0; i < nth; i++) {
        if (i < nums.length) {
            spoken1.set(nums[i], i);
            lastSpoken = nums[i];
        } else {
            if (!spoken2.has(lastSpoken)) {
                lastSpoken = 0;
            } else {
                lastSpoken = spoken1.get(lastSpoken) - spoken2.get(lastSpoken);
            }

            if (spoken1.has(lastSpoken)) {
                spoken2.set(lastSpoken, spoken1.get(lastSpoken));
            }
            spoken1.set(lastSpoken, i);
        }
    }
    return lastSpoken;
});

export default R.pipe(parseInput, run(2020));