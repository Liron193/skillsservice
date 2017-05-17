"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("underscore");
const Stories_1 = require("./Stories");
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
        for (let skill of Stories_1.Stories.Instance.Skills) {
            let templates = Stories_1.Stories.Instance.get(skill);
            for (let Q of templates)
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
    generateExtensions(skill, Q, index, S, col) {
        if (index < Q.length) {
            let item = Q[index];
            if (item[0] === '#') {
                let values = Variables_1.Variables.Instance.get(item.substr(1));
                if (typeof (values) === 'object' && values.length > 0)
                    for (let value of values)
                        this.generateExtensions(skill, Q, index + 1, S + value, col);
                else
                    this.generateExtensions(skill, Q, index + 1, S + item.substr(1), col);
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
    FindQuestion(Q) {
        if (typeof (Q) !== 'string' || Q == null || Q.length < 3)
            return [];
        let result = [];
        for (let skill of Stories_1.Stories.Instance.Skills) {
            let templates = Stories_1.Stories.Instance.get(skill);
            for (let T of templates)
                this.searchTemplate(skill, Q.toLowerCase(), T, 0, '', result);
        }
        return result;
    }
    searchTemplate(skill, Q, T, index, S, result) {
        if (index < T.length) {
            if (S.length > 0)
                if (S.length > Q.length || !Q.startsWith(S))
                    return;
            let item = T[index];
            if (item[0] === '#') {
                let values = Variables_1.Variables.Instance.get(item.substr(1));
                if (typeof (values) === 'object' && values.length > 0)
                    for (let value of values)
                        this.searchTemplate(skill, Q, T, index + 1, S + value, result);
                else
                    this.searchTemplate(skill, Q, T, index + 1, S + item.substr(1), result);
            }
            else
                this.searchTemplate(skill, Q, T, index + 1, S + item, result);
        }
        else {
            if (S.length > 0 && this.CaseInsensitiveStringCompare(Q, S))
                result.push(skill);
        }
    }
    AutoComplete(Q, count) {
        return new Promise((resolve, reject) => {
            if (typeof (Q) !== 'string' || Q == null || Q.length < 3)
                return [];
            let result = [];
            for (let skill of Stories_1.Stories.Instance.Skills) {
                let templates = Stories_1.Stories.Instance.get(skill);
                for (let T of templates)
                    this.autoComplete(skill, Q.toLowerCase(), T, 0, '', result, count, false);
            }
            resolve(result);
        });
    }
    autoComplete(skill, Q, T, index, S, list, count, exceed) {
        if (index < T.length) {
            if (!(list.length < count))
                return false;
            if (S.length > 0) {
                if (S.length > Q.length) {
                    if (!exceed && !S.startsWith(Q))
                        return false;
                    exceed = true;
                }
                else {
                    if (!Q.startsWith(S))
                        return false;
                }
            }
            let item = T[index];
            if (item[0] === '#') {
                let values = Variables_1.Variables.Instance.get(item.substr(1));
                if (typeof (values) === 'object' && values.length > 0) {
                    for (let value of values)
                        if (this.autoComplete(skill, Q, T, index + 1, S + value, list, count, exceed))
                            return true;
                }
                return this.autoComplete(skill, Q, T, index + 1, S + item.substr(1), list, count, exceed);
            }
            return this.autoComplete(skill, Q, T, index + 1, S + item, list, count, exceed);
        }
        else {
            if (S.length < 1)
                return false;
            list.push({ query: S, skill: skill });
            return true;
        }
    }
}
exports.Generator = Generator;
//# sourceMappingURL=main.js.map