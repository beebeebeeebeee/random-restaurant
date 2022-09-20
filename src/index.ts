import * as dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT ?? 3000

import * as express from 'express'
import * as bodyParser from "body-parser"
import * as localtunnel from 'localtunnel'

import randomRouter from "./router/random.router";

const app = express()
app.use(bodyParser.json())
app.set('views engine', 'ejs')

app.use('/', randomRouter)

app.listen(PORT, async () => {
    console.log(`service is listening on http://localhost:${PORT}`)

    if (process.env.NODE_ENV === "development") {
        const tunnel = await localtunnel({
            port: PORT,
            host: 'https://lt.beebeebeeebeee.com',
            subdomain: 'random-restaurant'
        });
        console.log(`service is listening on ${tunnel.url}`);
    }
})


