import * as dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT ?? 3000

import './scheduler'
import * as express from 'express'
import * as bodyParser from "body-parser"
import * as localtunnel from 'localtunnel'

import {ViewRouter, ApiRouter} from "./router";

const app = express()
app.use(bodyParser.json())
app.set('views engine', 'ejs')

app.use('/', ViewRouter)
app.use('/api', ApiRouter)

app.listen(PORT, async () => {
    console.log(new Date(), `service is listening on http://localhost:${PORT}`)

    if (process.env.NODE_ENV === "development") {
        const tunnel = await localtunnel({
            port: PORT,
            host: 'https://lt.beebeebeeebeee.com',
            subdomain: 'random-restaurant'
        });
        console.log(new Date(), `service is listening on ${tunnel.url}`);
    }
})


