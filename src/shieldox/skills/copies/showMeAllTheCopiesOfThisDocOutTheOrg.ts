import { iSkill } from '../../../iSkill';
import { iQueryResponse } from '../../../iResponse';
import * as request from 'request';

const baseURL = "https://api.shieldox.com/api";


export class showMeAllTheCopiesOfThisDocOutTheOrg {

    constructor(private AUTH: string, private AccTYPE: number,
        private AccID: string, private threadId: string, private company: string) {

    }

    private getfromTree(): Promise<any> {
        return new Promise((resolve, reject) => {
            const headers = {
                "Content-Type": "application/json",
                "Authorization": this.AUTH,
                "sldx_accType": this.AccTYPE,
                "sldx_accId": this.AccID
            }
            request.post(baseURL + '/documents/tree', {
                headers: headers,
                json: true,
                body: { 'threadId': this.threadId }
            }, (err, response, body) => {
                const copies = typeof body == 'string' ? JSON.parse(body) : body;
                resolve(copies)
            });
        });
    }

    private filter(copies) {
        let arr = []
        console.log(copies.length)
        for (let i = 0; i < copies.length; i++) {
            //   console.log(copies[i]);
            if (copies[i].owner.email.replace(/.*@/, "") != this.company) {
                arr.push(copies[i])
            }
        }
        if (arr.length != 0) {
            return { "text": "yes", "num": arr.length, "copies": arr };
        } else {
            return { "text": "no" };
        }
    }

    exec(): Promise<iQueryResponse> {
        return new Promise((resolve, reject) => {
            this.getfromTree()
                .then(copies => {
                    resolve(this.filter(copies));
                });
        });
    }



}

