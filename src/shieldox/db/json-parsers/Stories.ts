import * as _ from 'underscore';
import * as fs from 'fs';
import * as jsonfile from 'jsonfile';
import * as express from 'express';
import { JSONS_PATH } from '../../../paths';


export class Stories {
    private loaded: boolean;
    private keys: string[];
    private items: Map<string, string[][]>;
    private static instance: Stories;
    private constructor() { }
    static get Instance(): Stories {
        let obj = Stories.instance;
        if (!!obj) return obj;
        obj = new Stories();
        obj.Load();
        return Stories.instance = obj;
    }
    private Load(): void {
        if (this.loaded || !fs.existsSync(JSONS_PATH + "/questions.json")) return; // "./questions.json"
        this.items = new Map<string, string[][]>();
        let jsonObj = jsonfile.readFileSync(JSONS_PATH + "/questions.json", { throws: false });// "./questions.json"
        if (typeof (jsonObj) !== 'object' || !!!jsonObj) return null;
        this.keys = Object.keys(jsonObj);
        this.keys.forEach(name => {
            let templates: string[] = jsonObj[name] as string[];
            let compiledTemplates: string[][] = [];
            for (var temp of templates) {
                if (temp.length > 0) {
                    var compiled: string[] = this.compile(temp);
                    compiledTemplates.push(compiled);
                }
            }
            this.items.set(name, compiledTemplates);
        });
        this.loaded = true;
    }
    get(name: string): string[][] {
        let value: any = this.items.get(name);
        return value as string[][];
    }
    get Skills(): string[] {
        return this.keys;
    }
    private compile(value: string): string[] {
        let result = [];
        let hashtag: boolean = false, bracket: boolean = false;
        let item: string = '';
        for (let x = 0; x < value.length; x++) {
            let ch: string = value.charAt(x);
            if (ch === '#') {
                bracket = false;
                hashtag = true;
                if (item.length > 0)
                    result.push(item);
                item = ch;
            } else if (ch === '[') {
                bracket = true;
                hashtag = false;
                if (item.length > 0)
                    result.push(item);
                item = ch;
            } else if (ch === ']') {
                bracket = false;
                hashtag = false;
                if (item.length > 0)
                    result.push(item + ch);
                item = '';
            } else if (hashtag || bracket) {
                if (!(ch < 'a' || ch > 'z') || !(ch < 'A' || ch > 'Z') || ch == '_')
                    item += ch;
                else {
                    bracket = false;
                    hashtag = false;
                    if (item.length > 0)
                        result.push(item);
                    item = ch;
                }
            } else
                item += ch;
            if (x == value.length - 1) {
                if (item.length > 0)
                    result.push(item);
            }
        }
        return result;
    }
}
