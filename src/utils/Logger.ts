import * as colors from 'colors';

const isLog: boolean = process.env.ENV != 'dev' && process.env.ENV != 'prod';

export class Logger {
    public static d(tag: string, msg: string) {
        if (isLog) {
            console.log(tag, msg);
        }
    }

    public static e(tag: string, msg: string, err: any) {
        if (isLog) {
            console.log(tag, msg, err);
        }
    }
}