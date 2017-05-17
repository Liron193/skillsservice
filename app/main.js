"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config_1 = require("./config");
const Logger_1 = require("./utils/Logger");
// routes
const shieldox_1 = require("./shieldox/shieldox");
const TAG = 'Main';
const app = express();
app.use(express.static(path.join(__dirname, 'app/public')));
app.use(bodyParser.json());
app.use(cors());
/*skills categories*/
app.use('/shieldox', shieldox_1.router);
/*page not found*/
app.use((req, res, next) => {
    res.status(404).end();
});
app.listen(config_1.PORT)
    .on('listening', () => { Logger_1.Logger.d(TAG, 'server is listenning on port : ' + config_1.PORT); })
    .on('error', (err) => { Logger_1.Logger.e(TAG, 'server listenning err ', err); });
//# sourceMappingURL=main.js.map