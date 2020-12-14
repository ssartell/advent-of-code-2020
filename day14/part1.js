import R from 'ramda';

const lineRegex = /(mask|mem)(?:(?:\[(\d*)\] = (\d*))|(?: = (.*)))/;
const tryParseInt = x => isNaN(parseInt(x)) ? x : parseInt(x);
const readLine = R.pipe(R.match(lineRegex), R.tail, R.zipObj(['op', 'addr', 'val', 'mask']), R.evolve({addr: parseInt, val: tryParseInt}));
const parseInput = R.pipe(R.split('\n'), R.map(readLine));

const applyMask = (mask, val) => {
    let ones = mask.replace(/X/g, '0');
    let zeros = mask.replace(/X/g, '1');
    let value = `000000000000000000000000000000000000${val.toString(2)}`.substr(-36);
    return parseInt(value.split('').map((x, i) => ones[i] === '1' ? '1' : (zeros[i] === '0' ? '0' : x)).join(''), 2);
}

const ops = {
    'mask': (state, line) => {
        state.mask = line.mask;
    },
    'mem': (state, line) => {
        state.mem[line.addr] = applyMask(state.mask, line.val);
    }
}

const run = prog => {
    let state = { mem: {} };
    for(const line of prog) {
        ops[line.op](state, line);
    }
    return state;
}

export default R.pipe(parseInput, run, R.prop('mem'), R.values, R.sum);