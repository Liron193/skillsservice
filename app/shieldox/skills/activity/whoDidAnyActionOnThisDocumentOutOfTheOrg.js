"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const baseURL = "https://api.shieldox.com/api";
class whoDidAnyActionOnThisDocumentOutOfTheOrg {
    constructor(AUTH, AccTYPE, AccID, threadId, objectId, activity, domain) {
        this.AUTH = AUTH;
        this.AccTYPE = AccTYPE;
        this.AccID = AccID;
        this.threadId = threadId;
        this.objectId = objectId;
        this.activity = activity;
        this.domain = domain;
    }
    //Makes the request from ShielDox server and returns an Array of objects(documents)
    getfromquery() {
        return new Promise((resolve, reject) => {
            const headers = {
                "Content-Type": "application/json",
                "Authorization": this.AUTH,
                "sldx_accType": this.AccTYPE,
                "sldx_accId": this.AccID
            };
            request.post(baseURL + '/activity/get2', {
                headers: headers,
                json: true,
                body: { threadId: this.threadId }
            }, (err, response, body) => {
                var user = typeof body == 'string' ? JSON.parse(body) : body;
                console.log('getfromquery, user = ' + JSON.stringify(user));
                resolve(user);
            });
            ;
        });
    }
    //returns the number of the activity type according to the question we got from the client
    activityENUM() {
        var activityObj = {
            'opened': 0,
            'saved': 1,
            'printedscreen': 2,
            'printed': 3,
            'copypast': 4,
            'emailsend': 5,
            'browser_upload': 6,
            'unsafe_format': 9
        };
        return activityObj[this.activity.toLowerCase()];
    }
    //checks the question the client asked and filters the array of files we got from the server according to it.
    //It returns an object that contains whether some action made on the file and if yes, it will return an object that contains the answer yes plus
    // the list of people who have done this action.
    isSomeActionDoneOnThisDocumentAndFilterWho(userArray, activitynum) {
        var Documentarr = [];
        userArray.forEach((element) => {
            if (element.objectId == this.objectId && element.owner.email.replace(/.*@/, "") != this.domain) {
                Documentarr.push(element);
            }
            ;
        });
        if (Documentarr.length == 0) {
            return { text: 'no' };
        }
        else {
            var emailsWhoPrinted = [];
            Documentarr.forEach((element) => {
                if (element.type == activitynum) {
                    emailsWhoPrinted.push(element.owner.email);
                }
            });
            if (emailsWhoPrinted.length == 0) {
                return { text: 'no' };
            }
            else {
                return { text: 'yes', name: emailsWhoPrinted };
            }
        }
    }
    exec() {
        return new Promise((resolve, reject) => {
            this.getfromquery()
                .then(userArray => {
                const activitynum = this.activityENUM();
                const result = this.isSomeActionDoneOnThisDocumentAndFilterWho(userArray, activitynum);
                resolve(result);
            });
        });
    }
}
exports.whoDidAnyActionOnThisDocumentOutOfTheOrg = whoDidAnyActionOnThisDocumentOutOfTheOrg;
//# sourceMappingURL=whoDidAnyActionOnThisDocumentOutOfTheOrg.js.map