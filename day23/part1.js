import R from 'ramda';

const debug = x => { debugger; return x; };

const parseInput = R.pipe(R.split(''), R.map(parseInt));

const run = input => {
    let head;
    let last;
    let index = new Map();
    for(let x of R.reverse(input)) {
        head = { value: x, next: head };
        last = last || head;
        index.set(x, head);
    }
    last.next = head;
    
    let current = head;
    for(let i = 0; i < 100; i++) {
        let cup1 = current.next;
        let cup2 = cup1.next;
        let cup3 = cup2.next;
        let values = [ cup1.value, cup2.value, cup3.value ];
        let newNext = cup3.next;
        current.next = newNext;
        
        let dest = current.value - 1;
        if (dest < 1) dest = 9;
        while (R.contains(dest, values)) {
            dest--;
            if (dest < 1) dest = 9;
        }
        dest = index.get(dest);
        cup3.next = dest.next;
        dest.next = cup1;
        current = current.next;
    }

    current = index.get(1).next;
    let str = '';
    while(current.value !== 1) {
        str += current.value;
        current = current.next;
    }

    return str;
}

export default R.pipe(parseInput, run);