import * as express from 'express';
import * as HttpStatus from 'http-status';
import { appConfig } from '../config';
// === models ===
import { iSkill } from '../iSkill';
// === skills === 
import { ShieldoxSkillFactory } from './skills/ShieldoxSkillFactory';
// === utils ===
import { Logger } from '../utils/Logger';
import { Generator, AutoCompleteResult } from './db/json-parsers/main';

const TAG: string = 'shieldox';
const END_POINT: string = appConfig.shieldox.url;
const router: express.Router = express.Router();

router.get('/query', (req: express.Request, res: express.Response) => {

})

router.get('/autocomplete', (req: express.Request, res: express.Response) => {
    const str: string = req.query.str;
    const amount: number = req.query.amount;
    Generator.Instance.AutoComplete(str, amount)
        .then((results: AutoCompleteResult[]) => {
            res.json(results);
        })
        .catch((err) => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
        })
})

router.post('/exec', (req: express.Request, res: express.Response) => {
    const skillName: string = req.body.skill;
    Logger.d(TAG, `skillName : ${skillName}`);
    let skill: iSkill<any>;
    if (skillName) {
        skill = ShieldoxSkillFactory.make(skillName, req.headers, req.body);
        if (skill) {
            skill.exec(req.body)
                .then((result: any) => {
                    handleResponse(res, result);
                }).catch((err) => { handleErr(res, err) });
        } else {
            res.status(HttpStatus.BAD_REQUEST).end();
        }
    } else {
        res.status(HttpStatus.BAD_REQUEST).end();
    }
});


function handleResponse(res: express.Response, result: any) {
    res.status(HttpStatus.OK).json(result);
}

function handleErr(res: express.Response, err: any) {
    res.status(HttpStatus.BAD_REQUEST).json(err);
}


export { router };