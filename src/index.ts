import './init/dotenv.init'
import './init/log4js.init'

import {startAlertCron} from './scheduler'
import * as express from 'express'
import {NextFunction, Request, Response} from 'express'
import * as bodyParser from "body-parser"
import * as localtunnel from 'localtunnel'
import {getLogger} from "log4js";
import {ApiRouter, ViewRouter} from "./router";
import {Config} from "./config";

const logger = getLogger()
const port = Config.port ?? 3000

const app = express()
app.use(bodyParser.json())
app.set('views engine', 'ejs')
app.use('/public', express.static('public'))

app.use((req: Request, res: Response, next: NextFunction) => {
    res.on("finish", function () {
        logger.info(res.statusCode, req.method, decodeURI(req.url));
    });
    next();
})
app.use('/', ViewRouter)
app.use('/api', ApiRouter)

app.listen(port, async () => {
    logger.info(`service is listening on http://localhost:${port}`)

    if (Config.nodeEnv === "development") {
        const tunnel = await localtunnel({
            port: Number(port),
            host: 'https://lt.beebeebeeebeee.com',
            subdomain: 'random-restaurant'
        });
        logger.info(`service is listening on ${tunnel.url}`);
    }

    startAlertCron()
})


