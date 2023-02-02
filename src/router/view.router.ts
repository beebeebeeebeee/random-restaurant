import * as express from 'express'
import {Request, Response} from 'express'
import {generateImage, stringUtil} from "../util";
import {getAlertById, getRandomRestaurant} from "../service";
import {RestaurantType} from "../type";
import * as basicAuth from 'express-basic-auth'
import {ViewEndpointConstant} from "../constant";
import {Config} from "../config";

const {domain, publicUrl} = Config
const ViewRouter = express.Router()

ViewRouter.get(ViewEndpointConstant.ROOT, (req, res) => {
    return res.redirect(stringUtil.replaceUrlParams(ViewEndpointConstant.BOARD_DRAW, {
        boardId: 1,
        seed: Math.random().toString().slice(2),
        timestamp: +new Date()
    }, `${domain}${publicUrl}`))
})

ViewRouter.get(ViewEndpointConstant.ALERT_VIEW,
    basicAuth({
        users: {[Config.basicAuthUser]: Config.basicAuthPassword},
        challenge: true,
        realm: Config.basicAuthRealm,
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
async function getRandomRestaurantByRequest(req: Request): Promise<[RestaurantType[], string]> {
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

async function routeImage(req: Request, res: Response) {
    const query = req.params.query || ''
    req.query = Object.fromEntries(query.replace(/&amp;/g, '&').split('&').map((el: string) => el.split("=")))
    const [_, restaurantResultList] = await getRandomRestaurantByRequest(req)

    const img = Buffer.from(generateImage(restaurantResultList).split(',')[1], 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
    });
    res.end(img);
}

ViewRouter.get(ViewEndpointConstant.IMAGE_VIEW, routeImage)
ViewRouter.get(ViewEndpointConstant.IMAGE_VIEW_QUERY, routeImage)

ViewRouter.get(ViewEndpointConstant.BOARD_DRAW, async (req, res) => {
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
