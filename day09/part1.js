import R, { set } from 'ramda';

const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.split('\n'), R.map(parseInt));

export const firstInvalidXmas = R.curry((preambleSize, data) => {
    let prevNums = new Set(R.take(preambleSize, data));
    for(let i = preambleSize; i < data.length; i++) {
        let num = data[i];
        let pairFound = false;
        for(let a of prevNums) {
            let b = num - a;
            if (a !== b && prevNums.has(b)) {
                pairFound = true;
                break;
            }
        }
        if (!pairFound) return num;
        prevNums.delete(data[i - preambleSize]);
        prevNums.add(num);
    }
});

export default R.pipe(parseInput, firstInvalidXmas(25));