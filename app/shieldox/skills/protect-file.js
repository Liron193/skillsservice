"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
class ProtectFile {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }
    exec(args) {
        // calling shieldox endpoint
        return new Promise((resolve, reject) => {
            request.get(this.endpoint + '/file/color', () => {
                resolve('result');
            });
        });
    }
}
exports.ProtectFile = ProtectFile;
//# sourceMappingURL=protect-file.js.map