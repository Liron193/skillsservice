import { iSkill } from '../../../iSkill';
import { iQueryResponse } from '../../../iResponse';
import * as request from 'request';


const baseURL = "https://api.shieldox.com/api";

export class showMeAllTheCopiesOfThisDoc implements iSkill<{ fileId: string }>{

    constructor(private AUTH: string, private AccTYPE: number,
        private AccID: string, private threadId: string) {

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
            });;
        });
    }

    exec(): Promise<iQueryResponse> {
        return new Promise((resolve, reject) => {
            this.getfromTree()
                .then(copies => {
                    if (copies.length != 0) {
                        resolve({ text: "yes", num: copies.length, copies: copies });
                    }
                    else {
                        resolve({ text: "no" })
                    }
                });
        });
    }


}

