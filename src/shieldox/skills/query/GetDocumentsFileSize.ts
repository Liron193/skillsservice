import { iSkill } from '../../../iSkill';
import { iQueryResponse } from '../../../iResponse';
import * as request from 'request';

const baseURL = "https://api.shieldox.com/api";

export class GetDocumentsFileSize implements iSkill<{ fileId: string }>{

    constructor(private AUTH: string, private AccTYPE: number,
        private AccID: string, private objectId : string) {

    }

    //Makes the request from ShielDox server and returns an Array of objects(documents)
    private getfromquery(): Promise<Object> {
        return new Promise((resolve, reject) => {
            const headers = {
                "Content-Type": "application/json",
                "Authorization": this.AUTH,
                "sldx_accType": this.AccTYPE,
                "sldx_accId": this.AccID
            }
            request.get(baseURL + '/documents/queryId?' + this.objectId, {
                json: true,
                headers: headers
            }, (err, response, body) => {
                const document: any = typeof body == 'string' ? JSON.parse(body) : body;
                console.log('getfromquery, user = ' + JSON.stringify(document));
                resolve(document);
            });
        });

    }

    private getFilesSize(document): { size: number } {
        console.log(document);
        return {'size': document[0].size};
    }

    exec(): Promise<iQueryResponse> {
        return new Promise((resolve, reject) => {
            this.getfromquery()
                .then(document => {
                    const result: { size: number } = this.getFilesSize(document);
                    resolve(result);
                })
        });
    }

}




