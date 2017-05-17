"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("underscore");
const Questions_1 = require("./Questions");
const Variables_1 = require("./Variables");
const Responses_1 = require("./Responses");
class Generator {
    get Stories() {
        return this.m_items = this.GetStories();
    }
    constructor() { }
    static get Instance() {
        return Generator.instance || (Generator.instance = new Generator());
    }
    GetStories() {
        if (typeof (this.m_items) === 'object' && this.m_items != null)
            return this.m_items;
        this.m_items = new Map();
        for (let skill of Questions_1.Questions.Instance.Skills) {
            let Q = Questions_1.Questions.Instance.get(skill);
            this.generateExtensions(skill, Q, 0, '', this.m_items);
        }
        return this.m_items;
    }
    LocateSkills(Q) {
        let result = [];
        if (typeof (Q) !== 'string' || Q == null || (Q = Q.trim()).length < 1)
            return result;
        let stories = this.Stories;
        for (let e of stories) {
            for (let q of e[1])
                if (this.CaseInsensitiveStringCompare(Q, q)) {
                    result.push(e[0]);
                    break;
                }
        }
        return result;
    }
    GetResponse(skill, responseId, args) {
        let responseText = Responses_1.Responses.Instance.get(skill, responseId);
        if (typeof (responseText) !== 'string' || responseText == null || responseText.length < 1)
            return '';
        let matches = _.uniq(responseText.match(/\[[a-z0-9_]+\]/ig));
        if (matches.length < 1)
            return responseText;
        if (typeof (args) !== 'object' || args == null || typeof (args.get) !== 'function')
            return '';
        for (let match of matches) {
            let name = match.substr(1, match.length - 2);
            let value = this.CaseInsensitiveGetEntity(args, name);
            if (typeof (value) !== 'string' || value == null || value.length < 1)
                return '';
            responseText = responseText.replace(match, value);
        }
        return responseText;
    }
    CaseInsensitiveGetEntity(col, key) {
        if (typeof (col) !== 'object' || col == null || typeof (key) !== 'string' || key == null || key.length < 1)
            return undefined;
        for (let e of col)
            if (this.CaseInsensitiveStringCompare(key, e[0]))
                return e[1];
        return undefined;
    }
    CaseInsensitiveStringCompare(x, y) {
        if (typeof (x) !== "string" || x == null || x.length < 1) {
            return (typeof (y) !== "string" || y == null || y.length < 1);
        }
        if (typeof (y) !== "string" || y == null || y.length < 1)
            return false;
        if (x.length != y.length)
            return false;
        for (let a = 0; a < x.length; a++) {
            if (x[a] === y[a])
                continue;
            if (x[a].toLocaleLowerCase() !== y[a].toLocaleLowerCase())
                return false;
        }
        return true;
    }
    generateExtensions(skill, Q, index, S, col) {
        if (index < Q.length) {
            let item = Q[index];
            if (item[0] === '#') {
                let values = Variables_1.Variables.Instance.get(item.substr(1));
                if (typeof (values) === 'object' && values.length > 0)
                    for (let value of values)
                        this.generateExtensions(skill, Q, index + 1, S + value, col);
                else
                    this.generateExtensions(skill, Q, index + 1, S + item, col);
            }
            else
                this.generateExtensions(skill, Q, index + 1, S + item, col);
        }
        else {
            let arr = col.get(skill);
            if (typeof (arr) !== 'object')
                col.set(skill, arr = []);
            arr.push(S);
        }
    }
}
exports.Generator = Generator;
//# sourceMappingURL=Generator.js.map