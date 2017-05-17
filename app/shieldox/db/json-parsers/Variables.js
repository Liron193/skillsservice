"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const jsonfile = require("jsonfile");
const paths_1 = require("../../../paths");
class Variables {
    constructor() { }
    static get Instance() {
        let obj = Variables.instance;
        if (!!obj)
            return obj;
        obj = new Variables();
        obj.Load();
        return Variables.instance = obj;
    }
    Load() {
        if (this.loaded || !fs.existsSync(paths_1.JSONS_PATH + "/variables.json"))
            return; // "./variables.json"
        this.items = new Map();
        let jsonObj = jsonfile.readFileSync(paths_1.JSONS_PATH + "/variables.json", { throws: false }); // "./variables.json"
        if (typeof (jsonObj) !== 'object' || !!!jsonObj)
            return null;
        this.keys = Object.keys(jsonObj);
        this.keys.forEach(name => this.items.set(name, jsonObj[name]));
        this.loaded = true;
    }
    get(name) {
        let value = this.items.get(name);
        return value;
    }
}
exports.Variables = Variables;
//# sourceMappingURL=Variables.js.map