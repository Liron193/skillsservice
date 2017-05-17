"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const jsonfile = require("jsonfile");
const paths_1 = require("../../../paths");
class Responses {
    constructor() { }
    static get Instance() {
        let obj = Responses.instance;
        if (!!obj)
            return obj;
        obj = new Responses();
        obj.Load();
        return Responses.instance = obj;
    }
    Load() {
        if (this.loaded || !fs.existsSync(paths_1.JSONS_PATH + "/responses.json"))
            return; //  ./responses.json
        this.items = new Map();
        let jsonObj = jsonfile.readFileSync(paths_1.JSONS_PATH + "/responses.json", { throws: false }); //  ./responses.json
        if (typeof (jsonObj) !== 'object' || !!!jsonObj)
            return null;
        let skills = Object.keys(jsonObj);
        for (let skill of skills) {
            let col = new Map();
            this.items.set(skill, col);
            let responses = jsonObj[skill];
            let responseIds = Object.keys(responses);
            for (let responseId of responseIds) {
                let responseText = responses[responseId];
                col.set(responseId, responseText);
            }
        }
        this.loaded = true;
    }
    get(skill, responseId) {
        if (typeof (skill) !== 'string' || skill == null || skill.length < 1)
            return '';
        let responses = this.items.get(skill);
        if (typeof (responses) !== 'object' || responses == null)
            return '';
        if (typeof (responseId) !== 'string' || responseId == null || responseId.length < 1)
            return '';
        return responses.get(responseId) || '';
    }
}
exports.Responses = Responses;
//# sourceMappingURL=Responses.js.map