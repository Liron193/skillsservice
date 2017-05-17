"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isLog = process.env.ENV != 'dev' && process.env.ENV != 'prod';
class Logger {
    static d(tag, msg) {
        if (isLog) {
            console.log(tag, msg);
        }
    }
    static e(tag, msg, err) {
        if (isLog) {
            console.log(tag, msg, err);
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map