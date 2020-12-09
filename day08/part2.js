import R from 'ramda';

const readLine = R.pipe(R.split(' '), R.zipObj(['op', 'arg']), R.evolve({'arg': parseInt}));
const parseInput = R.pipe(R.split('\n'), R.map(readLine));

const compile = code => {
    code = R.clone(code);

    let i = 0;
    let accumulator = 0;

    let ops = {
        'acc': (line) => {
            accumulator += line.arg;
            i++;
        },
        'jmp': (line) => {
            i += line.arg;
        },
        'nop': (line) => {
            i++;
        }
    };

    let prevExecuted = new Set();
    let hasLooped = () => {
        if (prevExecuted.has(i)) return true;
        prevExecuted.add(i);
        return false;
    };

    let terminated = () => i >= code.length;

    let run = () => {
        while(!terminated() && !hasLooped()) {
            let line = code[i];
            ops[line.op](line);
        }
        return {
            accumulator,
            terminated: terminated()
        };
    };

    return {
        run
    };
};

const findBorkedLine = code => {
    for (const line of code) {
        let op = line.op;
        if (op === 'acc') continue;
        line.op = line.op === 'nop' ? 'jmp' : 'nop';
        let program = compile(code);
        let result = program.run();
        if (result.terminated) return result.accumulator;
        line.op = op;
    }
}

export default R.pipe(parseInput, findBorkedLine);