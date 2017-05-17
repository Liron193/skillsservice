import * as config from 'config';

const ENV: string = process.env.ENV || 'prod';

export const appConfig: ConfigModel = <ConfigModel>config.get(ENV == 'dev' ? 'dev' : 'prod');
export const PORT: number = process.env.PORT || 3000;

export interface ConfigModel {
    shieldox: {
        url: string;
    }
}