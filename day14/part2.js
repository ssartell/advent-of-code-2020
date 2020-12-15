import R from 'ramda';

const lineRegex = /(mask|mem)(?:(?:\[(\d*)\] = (\d*))|(?: = (.*)))/;
const tryParseInt = x => isNaN(parseInt(x)) ? x : parseInt(x);
const readLine = R.pipe(R.match(lineRegex), R.tail, R.zipObj(['op', 'addr', 'val', 'mask']), R.evolve({addr: parseInt, val: tryParseInt}));
const parseInput = R.pipe(R.split('\n'), R.map(readLine));

const applyMask = (mask, val) => {
    val = `000000000000000000000000000000000000${val.toString(2)}`.substr(-36);
    return mask.split('')
        .map((x, i) => {
            if (x === '0') return val[i];
            if (x === '1') return '1';
            if (x === 'X') return 'X';
        })
        .join('');
};

const write = (mem, addr, val) => {
    if (addr.indexOf('X') < 0) {
        mem[parseInt(addr, 2)] = val;
        return;
    } else {
        write(mem, addr.replace('X', '0'), val);
        write(mem, addr.replace('X', '1'), val);
    }
};

const ops = {
    'mask': (state, line) => {
        state.mask = line.mask;
    },
    'mem': (state, line) => {
        let addr = applyMask(state.mask, line.addr);
        write(state.mem, addr, line.val);
    }
};

const run = prog => {
    let state = { mem: {} };
    for(const line of prog) {
        ops[line.op](state, line);
    }
    return state;
};

export default R.pipe(parseInput, run, R.prop('mem'), R.values, R.sum);