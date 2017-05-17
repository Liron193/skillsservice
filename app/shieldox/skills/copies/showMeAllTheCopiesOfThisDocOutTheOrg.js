"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const baseURL = "https://api.shieldox.com/api";
class showMeAllTheCopiesOfThisDocOutTheOrg {
    constructor(AUTH, AccTYPE, AccID, threadId, company) {
        this.AUTH = AUTH;
        this.AccTYPE = AccTYPE;
        this.AccID = AccID;
        this.threadId = threadId;
        this.company = company;
    }
    getfromTree() {
        return new Promise((resolve, reject) => {
            const headers = {
                "Content-Type": "application/json",
                "Authorization": this.AUTH,
                "sldx_accType": this.AccTYPE,
                "sldx_accId": this.AccID
            };
            request.post(baseURL + '/documents/tree', {
                headers: headers,
                json: true,
                body: { 'threadId': this.threadId }
            }, (err, response, body) => {
                const copies = typeof body == 'string' ? JSON.parse(body) : body;
                resolve(copies);
            });
        });
    }
    filter(copies) {
        let arr = [];
        console.log(copies.length);
        for (let i = 0; i < copies.length; i++) {
            //   console.log(copies[i]);
            if (copies[i].owner.email.replace(/.*@/, "") != this.company) {
                arr.push(copies[i]);
            }
        }
        if (arr.length != 0) {
            return { "text": "yes", "num": arr.length, "copies": arr };
        }
        else {
            return { "text": "no" };
        }
    }
    exec() {
        return new Promise((resolve, reject) => {
            this.getfromTree()
                .then(copies => {
                resolve(this.filter(copies));
            });
        });
    }
}
exports.showMeAllTheCopiesOfThisDocOutTheOrg = showMeAllTheCopiesOfThisDocOutTheOrg;
//# sourceMappingURL=showMeAllTheCopiesOfThisDocOutTheOrg.js.map