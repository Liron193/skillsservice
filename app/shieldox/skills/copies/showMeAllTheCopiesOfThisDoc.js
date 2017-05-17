"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const baseURL = "https://api.shieldox.com/api";
class showMeAllTheCopiesOfThisDoc {
    constructor(AUTH, AccTYPE, AccID, threadId) {
        this.AUTH = AUTH;
        this.AccTYPE = AccTYPE;
        this.AccID = AccID;
        this.threadId = threadId;
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
            ;
        });
    }
    exec() {
        return new Promise((resolve, reject) => {
            this.getfromTree()
                .then(copies => {
                if (copies.length != 0) {
                    resolve({ text: "yes", num: copies.length, copies: copies });
                }
                else {
                    resolve({ text: "no" });
                }
            });
        });
    }
}
exports.showMeAllTheCopiesOfThisDoc = showMeAllTheCopiesOfThisDoc;
//# sourceMappingURL=showMeAllTheCopiesOfThisDoc.js.map