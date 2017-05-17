import { iSkill } from '../../iSkill';
import { iDoResponse } from '../../iResponse';
import * as request from 'request';

export class ProtectFile implements iSkill<{ fileId: string }> {

    constructor(private endpoint: string) {

    }

    exec(args: { fileId: string }): Promise<iDoResponse> {
        // calling shieldox endpoint
        return new Promise((resolve, reject) => {
            request.get(this.endpoint + '/file/color', () => {
                resolve('result');
            });
        })
    }
}