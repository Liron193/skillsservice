import * as _ from 'underscore';
import * as fs from 'fs';
import * as jsonfile from 'jsonfile';
import { JSONS_PATH } from '../../../paths';

export class Responses {
    private loaded: boolean;
    private items: Map<string, Map<string, string>>;
    private static instance: Responses;
    private constructor() { }
    static get Instance(): Responses {
        let obj = Responses.instance;
        if (!!obj) return obj;
        obj = new Responses();
        obj.Load();
        return Responses.instance = obj;
    }
    private Load(): void {
        if (this.loaded || !fs.existsSync(JSONS_PATH +  "/responses.json")) return; //  ./responses.json
        this.items = new Map<string, Map<string, string>>();
        let jsonObj = jsonfile.readFileSync(JSONS_PATH +  "/responses.json", { throws: false }); //  ./responses.json
        if (typeof (jsonObj) !== 'object' || !!!jsonObj) return null;
        let skills: string[] = Object.keys(jsonObj);
        for (let skill of skills) {
            let col = new Map<string, string>();
            this.items.set(skill, col);
            let responses = jsonObj[skill];
            let responseIds: string[] = Object.keys(responses);
            for (let responseId of responseIds) {
                let responseText = responses[responseId] as string;
                col.set(responseId, responseText);
            }
        }
        this.loaded = true;
    }
    get(skill: string, responseId: string): string {
        if (typeof (skill) !== 'string' || skill == null || skill.length < 1) return '';
        let responses: Map<string, string> = this.items.get(skill);
        if (typeof (responses) !== 'object' || responses == null) return '';
        if (typeof (responseId) !== 'string' || responseId == null || responseId.length < 1) return '';
        return responses.get(responseId) as string || '';
    }
}
