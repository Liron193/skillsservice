import { Generator } from './shieldox/db/json-parsers/main';
import * as jsonfile from 'jsonfile';
import { JSONS_PATH } from './paths';
import * as fs from 'fs';


let result = Generator.Instance.AutoComplete("does", 10);
console.dir(result);
