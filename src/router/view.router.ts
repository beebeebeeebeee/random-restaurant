import * as express from 'express'
import {generateImage} from "../util";
import {getRandomRestaurant, getAlertById} from "../service";
import {RestaurantType} from "../type";
import * as basicAuth from 'express-basic-auth'

const domain = process.env.DOMAIN || ''
const publicUrl = process.env.PUBLIC_URL || ''
const ViewRouter = express.Router()

ViewRouter.get("/", (req, res) => {
    return res.redirect(`${domain}${publicUrl}/boardId/1/seed/${Math.random().toString().slice(2)}/timestamp/${+new Date()}`)
})

ViewRouter.get("/config/alertId/:alertId",
    basicAuth({
        users: {[process.env.BASIC_AUTH_USER]: process.env.BASIC_AUTH_PASSWORD},
        challenge: true,
        realm: process.env.BASIC_AUTH_REALM,
    }),
    async (req, res) => {
        const {alertId} = req.params
        const result = await getAlertById(alertId)
        return res.render('config.alert.page.ejs', {
            publicUrl,
            result
        });
    })

/**
 * Get Random Restaurant By Request for getting image or page by boardId and seed
 * @param req the express req arg
 */
async function getRandomRestaurantByRequest(req): Promise<[RestaurantType[], string]> {
    const {boardId, seed, timestamp} = req.params
    const query = req.query as {
        times?: string,
        people?: string
    }
    const times = query.times != null ? parseInt(query.times) : undefined
    const people = query.people != null ? parseInt(query.people) : undefined

    const [restaurantList, indexes] = await getRandomRestaurant(boardId, seed, true, times, people, new Date(+timestamp))
    return [restaurantList, indexes.map(index => restaurantList[index]?.restaurant).join(', ')]
}

async function routeImage(req, res) {
    const query = req.params.query || ''
    req.query = Object.fromEntries(query.split('&').map((el: string) => el.split("=")))
    const [_, restaurantResultList] = await getRandomRestaurantByRequest(req)

    const img = Buffer.from(generateImage(restaurantResultList).split(',')[1], 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
    });
    res.end(img);
}

ViewRouter.get("/image/boardId/:boardId/seed/:seed/timestamp/:timestamp", routeImage)
ViewRouter.get("/image/boardId/:boardId/seed/:seed/timestamp/:timestamp/:query", routeImage)

ViewRouter.get("/boardId/:boardId/seed/:seed/timestamp/:timestamp", async (req, res) => {
    const {boardId, seed, timestamp} = req.params
    const [restaurantList, restaurantResultList] = await getRandomRestaurantByRequest(req)

    return res.render('result.page.ejs', {
        search: (req as any)._parsedUrl.search || '',
        publicUrl,
        boardId,
        seed,
        timestamp,
        image: generateImage(restaurantResultList),
        title: `Random Restaurant! - ${restaurantResultList}`,
        restaurantList,
        restaurant: restaurantResultList
    });
})


export {ViewRouter}
