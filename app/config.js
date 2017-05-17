"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const ENV = process.env.ENV || 'prod';
exports.appConfig = config.get(ENV == 'dev' ? 'dev' : 'prod');
exports.PORT = process.env.PORT || 3000;
//# sourceMappingURL=config.js.map