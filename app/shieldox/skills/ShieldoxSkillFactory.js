"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const activities = require("../skills/activity/all");
const copies = require("../skills/copies/all");
class ShieldoxSkillFactory {
    constructor() { }
    ;
    static make(skillName, headers, body) {
        let skill;
        switch (skillName) {
            case "":
                skill = new activities.whoDidAnyActionOnThisDocument(headers.auth, +headers.acctype, headers.accid, body.threadid, body.objid, body.argument);
                break;
            case "":
                skill = new activities.whoDidAnyActionOnThisDocumentOutOfTheOrg(headers.auth, +headers.acctype, headers.accid, body.threadid, body.objid, body.argument, body.domain);
                break;
            case "Shieldox_find_copies":
                skill = new copies.showMeAllTheCopiesOfThisDoc(headers.auth, +headers.acctype, headers.accid, body.threadid);
                break;
            case "Shieldox_find_copies_outside":
                skill = new copies.showMeAllTheCopiesOfThisDocOutTheOrg(headers.auth, +headers.acctype, headers.accid, body.threadid, body.companyDomain);
                break;
            default:
                return;
        }
        return skill;
    }
}
exports.ShieldoxSkillFactory = ShieldoxSkillFactory;
//# sourceMappingURL=ShieldoxSkillFactory.js.map