
import { Generator } from './main';

// let stories = Geneator.Instance.Stories;

// for (let e of stories) {
//     console.log(`\n${e[0]}:`);
//     for (let q of e[1])
//         console.log(q);
// }
// let args = new Map<string, string>();
// args.set('a', 'letter A');
// args.set('b', 'letter B');
// args.set('c', 'letter C');
// let response = Geneator.Instance.GetResponse('Shieldox_copies_outside', 'R1', args);
// console.log(response);

Generator.Instance.AutoComplete("does", 10)
    .then(console.dir);