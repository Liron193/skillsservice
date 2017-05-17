import { iSkill } from '../../iSkill';
import * as activities from '../skills/activity/all';
import * as copies from '../skills/copies/all';
import * as query from '../skills/query/all';

export class ShieldoxSkillFactory {

    private constructor() { };

    public static make(skillName: string, headers, body): iSkill<any> {
        let skill: iSkill<any>;
        switch (skillName) {
            case "":
                skill = new activities.whoDidAnyActionOnThisDocument(headers.auth,
                    +headers.acctype, headers.accid, body.threadid, body.objid, body.argument)
                break;
            case "":
                skill = new activities.whoDidAnyActionOnThisDocumentOutOfTheOrg(headers.auth, +headers.acctype, headers.accid, body.threadid, body.objid, body.argument, body.domain);
                break;
            case "Shieldox_find_copies":
                skill = new copies.showMeAllTheCopiesOfThisDoc(headers.auth, +headers.acctype, headers.accid, body.threadid);
                break;
            case "Shieldox_find_copies_outside":
                skill = new copies.showMeAllTheCopiesOfThisDocOutTheOrg(headers.auth, +headers.acctype, headers.accid, body.threadid, body.companyDomain)
                break;
            case "Shieldox_file_size":
                skill = new query.GetDocumentsFileSize(headers.auth, +headers.acctype, headers.accid, headers.objid )
                break;
            default:
                return
        }
        return skill;
    }
}