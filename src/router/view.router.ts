import * as express from 'express'
import {generateImage} from "../util";
import {getRandomRestaurant} from "../service";
import {RestaurantType} from "../type";
import {getAlertById} from "../service/alert.service";

const domain = process.env.DOMAIN || ''
const publicUrl = process.env.PUBLIC_URL || ''
const ViewRouter = express.Router()

ViewRouter.get("/", (req, res) => {
    return res.redirect(`${domain}${publicUrl}/boardId/1/seed/${Math.random().toString().slice(2)}`)
})

ViewRouter.get("/config/alertId/:alertId", async (req, res)=>{
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
    const {boardId, seed} = req.params
    const {times} = req.query as {
        times?: string
    }
    const [restaurantList, indexes] = await getRandomRestaurant(boardId, seed, true, times != null ? parseInt(times) : undefined)
    return [restaurantList, indexes.map(index => restaurantList[index]?.restaurant).join(', ')]
}

async function routeImage(req, res){
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

ViewRouter.get("/image/boardId/:boardId/seed/:seed", routeImage)
ViewRouter.get("/image/boardId/:boardId/seed/:seed/:query", routeImage)

ViewRouter.get("/boardId/:boardId/seed/:seed", async (req, res) => {
    const {boardId, seed} = req.params
    const [restaurantList, restaurantResultList] = await getRandomRestaurantByRequest(req)

    return res.render('result.page.ejs', {
        search: (req as any)._parsedUrl.search || '',
        publicUrl,
        boardId,
        seed,
        image: generateImage(restaurantResultList),
        title: `Random Restaurant! - ${restaurantResultList}`,
        restaurantList,
        restaurant: restaurantResultList
    });
})


export {ViewRouter}
