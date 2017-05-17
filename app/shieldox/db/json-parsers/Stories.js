"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const jsonfile = require("jsonfile");
const paths_1 = require("../../../paths");
class Stories {
    constructor() { }
    static get Instance() {
        let obj = Stories.instance;
        if (!!obj)
            return obj;
        obj = new Stories();
        obj.Load();
        return Stories.instance = obj;
    }
    Load() {
        if (this.loaded || !fs.existsSync(paths_1.JSONS_PATH + "/questions.json"))
            return; // "./questions.json"
        this.items = new Map();
        let jsonObj = jsonfile.readFileSync(paths_1.JSONS_PATH + "/questions.json", { throws: false }); // "./questions.json"
        if (typeof (jsonObj) !== 'object' || !!!jsonObj)
            return null;
        this.keys = Object.keys(jsonObj);
        this.keys.forEach(name => {
            let templates = jsonObj[name];
            let compiledTemplates = [];
            for (var temp of templates) {
                if (temp.length > 0) {
                    var compiled = this.compile(temp);
                    compiledTemplates.push(compiled);
                }
            }
            this.items.set(name, compiledTemplates);
        });
        this.loaded = true;
    }
    get(name) {
        let value = this.items.get(name);
        return value;
    }
    get Skills() {
        return this.keys;
    }
    compile(value) {
        let result = [];
        let hashtag = false, bracket = false;
        let item = '';
        for (let x = 0; x < value.length; x++) {
            let ch = value.charAt(x);
            if (ch === '#') {
                bracket = false;
                hashtag = true;
                if (item.length > 0)
                    result.push(item);
                item = ch;
            }
            else if (ch === '[') {
                bracket = true;
                hashtag = false;
                if (item.length > 0)
                    result.push(item);
                item = ch;
            }
            else if (ch === ']') {
                bracket = false;
                hashtag = false;
                if (item.length > 0)
                    result.push(item + ch);
                item = '';
            }
            else if (hashtag || bracket) {
                if (!(ch < 'a' || ch > 'z') || !(ch < 'A' || ch > 'Z') || ch == '_')
                    item += ch;
                else {
                    bracket = false;
                    hashtag = false;
                    if (item.length > 0)
                        result.push(item);
                    item = ch;
                }
            }
            else
                item += ch;
            if (x == value.length - 1) {
                if (item.length > 0)
                    result.push(item);
            }
        }
        return result;
    }
}
exports.Stories = Stories;
//# sourceMappingURL=Stories.js.map