"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const jsonfile = require("jsonfile");
class Questions {
    constructor() { }
    static get Instance() {
        let obj = Questions.instance;
        if (!!obj)
            return obj;
        obj = new Questions();
        obj.Load();
        console.dir(obj);
        return Questions.instance = obj;
    }
    Load() {
        const fileExists = fs.existsSync(__dirname + "/public/jsons/questions.json");
        if (this.loaded || !fileExists)
            return;
        this.items = new Map();
        let jsonObj = jsonfile.readFileSync(__dirname + "/public/jsons/questions.json", { throws: false });
        if (typeof (jsonObj) !== 'object' || !!!jsonObj)
            return null;
        this.keys = Object.keys(jsonObj);
        this.keys.forEach(name => {
            let q = jsonObj[name];
            if (q.length > 0) {
                var val = this.compile(q);
                this.items.set(name, val);
            }
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
        let hashtag = false;
        let item = '';
        for (let x = 0; x < value.length; x++) {
            let ch = value.charAt(x);
            if (ch === '#') {
                hashtag = true;
                if (item.length > 0)
                    result.push(item);
                item = ch;
            }
            else if (hashtag) {
                if (!(ch < 'a' || ch > 'z') || !(ch < 'A' || ch > 'Z'))
                    item += ch;
                else {
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
exports.Questions = Questions;
//# sourceMappingURL=Questions.js.map