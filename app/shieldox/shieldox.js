"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const HttpStatus = require("http-status");
const config_1 = require("../config");
// === skills === 
const ShieldoxSkillFactory_1 = require("./skills/ShieldoxSkillFactory");
// === utils ===
const Logger_1 = require("../utils/Logger");
const main_1 = require("./db/json-parsers/main");
const TAG = 'shieldox';
const END_POINT = config_1.appConfig.shieldox.url;
const router = express.Router();
exports.router = router;
router.get('/query', (req, res) => {
});
router.get('/autocomplete', (req, res) => {
    const str = req.query.str;
    const amount = req.query.amount;
    main_1.Generator.Instance.AutoComplete(str, amount)
        .then((results) => {
        res.json(results);
    })
        .catch((err) => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
    });
});
router.post('/exec', (req, res) => {
    const skillName = req.body.skill;
    Logger_1.Logger.d(TAG, `skillName : ${skillName}`);
    let skill;
    if (skillName) {
        skill = ShieldoxSkillFactory_1.ShieldoxSkillFactory.make(skillName, req.headers, req.body);
        if (skill) {
            skill.exec(req.body)
                .then((result) => {
                handleResponse(res, result);
            }).catch((err) => { handleErr(res, err); });
        }
        else {
            res.status(HttpStatus.BAD_REQUEST).end();
        }
    }
    else {
        res.status(HttpStatus.BAD_REQUEST).end();
    }
});
function handleResponse(res, result) {
    res.status(HttpStatus.OK).json(result);
}
function handleErr(res, err) {
    res.status(HttpStatus.BAD_REQUEST).json(err);
}
//# sourceMappingURL=shieldox.js.map