import R from 'ramda';
import Stack from 'mnemonist/stack.js';

const parseInput = R.pipe(R.split('\n'), R.map(R.replace(/\s/g, '')));
const evaluate = exp => {
    let vals = new Stack();
    let ops = new Stack();
    for(let i = 0; i < exp.length; i++) {
        let char = exp[i];
        let expEnd = false;
        if (R.test(/\d/, char)) {
            vals.push(parseInt(char));
            expEnd = true;
        } else if (char === '(') {
            ops.push(char);
        } else if (char === ')') {
            ops.pop();
            expEnd = true;
        } else if (char === '+') {
            ops.push(char);
        } else if (char === '*') {
            ops.push(char);
        }

        while (expEnd && ops.size > 0 && ops.peek() !== '(') {
            let b = vals.pop();
            let a = vals.pop();
            let op = ops.pop();
            if (op === '+') {
                vals.push(a + b);
            } else if (op === '*') {
                vals.push(a * b);
            }
        }
    }
    
    return vals.pop();
}

export default R.pipe(parseInput, R.map(evaluate), R.sum);