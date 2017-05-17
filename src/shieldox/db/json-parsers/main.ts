import * as _ from 'underscore';

import { Stories } from './Stories';
import { Variables } from './Variables';
import { Responses } from './Responses';

export interface AutoCompleteResult{
    skill:string;
    query:string;
}


export class Generator {
    private m_items: Map<string, string[]>;
    get Stories(): Map<string, string[]> {
        return this.m_items = this.GetStories();
    }
    private static instance: Generator;
    private constructor() { }
    static get Instance(): Generator {
        return Generator.instance || (Generator.instance = new Generator());
    }
    private GetStories(): Map<string, string[]> {
        if (typeof (this.m_items) === 'object' && this.m_items != null) return this.m_items;
        this.m_items = new Map<string, string[]>();
        for (let skill of Stories.Instance.Skills) {
            let templates: string[][] = Stories.Instance.get(skill);
            for (let Q of templates)
                this.generateExtensions(skill, Q, 0, '', this.m_items);
        }
        return this.m_items;
    }
    LocateSkills(Q: string): string[] {
        let result: string[] = [];
        if (typeof (Q) !== 'string' || Q == null || (Q = Q.trim()).length < 1) return result;
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
    generateExtensions(skill: string, Q: string[], index: number, S: string, col: Map<string, string[]>) {
        if (index < Q.length) {
            let item = Q[index];
            if (item[0] === '#') {
                let values: string[] = Variables.Instance.get(item.substr(1));
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
            let arr: string[] = col.get(skill);
            if (typeof (arr) !== 'object') col.set(skill, arr = []);
            arr.push(S);
        }
    }
    GetResponse(skill: string, responseId: string, args: Map<string, string>): string {
        let responseText = Responses.Instance.get(skill, responseId);
        if (typeof (responseText) !== 'string' || responseText == null || responseText.length < 1) return '';
        let matches = _.uniq(responseText.match(/\[[a-z0-9_]+\]/ig)) as string[];
        if (matches.length < 1) return responseText;
        if (typeof (args) !== 'object' || args == null || typeof (args.get) !== 'function') return '';
        for (let match of matches) {
            let name = match.substr(1, match.length - 2);
            let value = this.CaseInsensitiveGetEntity(args, name);
            if (typeof (value) !== 'string' || value == null || value.length < 1) return '';
            responseText = responseText.replace(match, value);
        }
        return responseText;
    }
    CaseInsensitiveGetEntity(col: Map<string, string>, key: string) {
        if (typeof (col) !== 'object' || col == null || typeof (key) !== 'string' || key == null || key.length < 1) return undefined;
        for (let e of col)
            if (this.CaseInsensitiveStringCompare(key, e[0]))
                return e[1];
        return undefined;
    }
    CaseInsensitiveStringCompare(x: string, y: string): boolean {
        if (typeof (x) !== "string" || x == null || x.length < 1) {
            return (typeof (y) !== "string" || y == null || y.length < 1);
        }
        if (typeof (y) !== "string" || y == null || y.length < 1) return false;
        if (x.length != y.length) return false;
        for (let a = 0; a < x.length; a++) {
            if (x[a] === y[a]) continue;
            if (x[a].toLocaleLowerCase() !== y[a].toLocaleLowerCase()) return false;
        }
        return true;
    }
    FindQuestion(Q: string): string[] {
        if (typeof (Q) !== 'string' || Q == null || Q.length < 3) return [];
        let result: string[] = [];
        for (let skill of Stories.Instance.Skills) {
            let templates: string[][] = Stories.Instance.get(skill);
            for (let T of templates)
                this.searchTemplate(skill, Q.toLowerCase(), T, 0, '', result);
        }
        return result;
    }
    private searchTemplate(skill: string, Q: string, T: string[], index: number, S: string, result: string[]) {
        if (index < T.length) {
            if (S.length > 0)
                if (S.length > Q.length || !Q.startsWith(S)) return;
            let item = T[index];
            if (item[0] === '#') {
                let values: string[] = Variables.Instance.get(item.substr(1));
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
    AutoComplete(Q: string, count: number): Promise<AutoCompleteResult[]> {
        return new Promise((resolve, reject) => {
            if (typeof (Q) !== 'string' || Q == null || Q.length < 3) return [];
            let result: AutoCompleteResult[] = [];
            for (let skill of Stories.Instance.Skills) {
                let templates: string[][] = Stories.Instance.get(skill);
                for (let T of templates)
                    this.autoComplete(skill, Q.toLowerCase(), T, 0, '', result, count, false);
            }
            resolve(result);
        });
    }
    private autoComplete(skill: string, Q: string, T: string[], index: number, S: string, list: AutoCompleteResult[], count: number, exceed: boolean): boolean {
        if (index < T.length) {
            if (!(list.length < count)) return false;
            if (S.length > 0) {
                if (S.length > Q.length) {
                    if (!exceed && !S.startsWith(Q)) return false;
                    exceed = true;
                } else {
                    if (!Q.startsWith(S)) return false;
                }
            }
            let item = T[index];
            if (item[0] === '#') {
                let values: string[] = Variables.Instance.get(item.substr(1));
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
            if (S.length < 1) return false;
            list.push({ query: S, skill: skill });
            return true;
        }
    }

}