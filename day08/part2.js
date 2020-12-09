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
    }

    let linesExecuted = new Set();
    let hasLooped = () => {
        let line = code[i];
        let key = `${i} ${line.op} ${line.arg}`;
        if (linesExecuted.has(key)) return true;
        linesExecuted.add(key);
        return false;
    }

    let terminated = () => i >= code.length;

    let run = () => {
        while(!terminated() && !hasLooped()) {
            let line = code[i];
            if (!line) debugger;
            ops[line.op](line);
        }
        return {
            accumulator,
            infiniteLoop: terminated() ? false : hasLooped(),
            terminated: terminated()
        };
    };

    return {
        run
    };
};

const findBorkedLine = code => {
    for (let i = 0; i < code.length; i++) {
        let line = code[i];
        if (line.op === 'acc') continue;
        let newLine = { op: line.op === 'nop' ? 'jmp' : 'nop', arg: line.arg };
        code[i] = newLine;
        let program = compile(code);
        let result = program.run();
        if (result.terminated) return result.accumulator;
        code[i] = line;
    }
}

export default R.pipe(parseInput, findBorkedLine);