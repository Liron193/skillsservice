import * as _ from 'underscore';
import * as fs from 'fs';
import * as jsonfile from 'jsonfile';
import { JSONS_PATH } from '../../../paths';

export class Variables {
    private loaded: boolean;
    private keys: string[];
    private items: Map<string, string[]>;
    private static instance: Variables;
    private constructor() { }
    static get Instance(): Variables {
        let obj = Variables.instance;
        if (!!obj) return obj;
        obj = new Variables();
        obj.Load();
        return Variables.instance = obj;
    }
    private Load(): void {
        if (this.loaded || !fs.existsSync(JSONS_PATH + "/variables.json")) return; // "./variables.json"
        this.items = new Map<string, string[]>();
        let jsonObj = jsonfile.readFileSync(JSONS_PATH + "/variables.json", { throws: false }); // "./variables.json"
        if (typeof (jsonObj) !== 'object' || !!!jsonObj) return null;
        this.keys = Object.keys(jsonObj);
        this.keys.forEach(name => this.items.set(name, jsonObj[name] as string[]));
        this.loaded = true;
    }
    get(name: string): string[] {
        let value: any = this.items.get(name);
        return value as string[];
    }
}