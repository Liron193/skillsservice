import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';


import { appConfig, ConfigModel, PORT } from './config';
import { Logger } from './utils/Logger';

// routes
import { router as shieldoxRoute } from './shieldox/shieldox';
const TAG: string = 'Main';

const app: express.Application = express();

app.use(express.static(path.join(__dirname, 'app/public')));


app.use(bodyParser.json());
app.use(cors());

/*skills categories*/
app.use('/shieldox', shieldoxRoute);

/*page not found*/
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(404).end();
})

app.listen(PORT)
    .on('listening', () => { Logger.d(TAG, 'server is listenning on port : ' + PORT) })
    .on('error', (err) => { Logger.e(TAG, 'server listenning err ', err) })