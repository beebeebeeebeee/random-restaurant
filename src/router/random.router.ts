import * as express from 'express'
import * as seedrandom from "seedrandom";
import {createRestaurant, database, deleteRestaurant, getRestaurantList, updateRestaurant} from "../database";
import {RestaurantModal} from "../modal/restaurant.modal";
import {generate} from "text-to-image";
import {getCanvasImage, HorizontalImage, registerFont, UltimateTextToImage, VerticalImage} from "ultimate-text-to-image";

const router = express.Router()

async function getRandomRestaurant(seed: string, isWeighted: boolean): Promise<[RestaurantModal[], number]> {
    const restaurantList = await getRestaurantList()

    let index: number
    if (isWeighted) {
        const total = restaurantList.reduce((p, c) => p + c.weight, 0)
        const cdf = restaurantList.map(e => e.weight).map((sum => value => sum += value / total)(0))
        index = cdf.filter(el => seedrandom(seed)() >= el).length
    } else {
        index = Math.floor(seedrandom(seed)() * restaurantList.length)
    }

    return [restaurantList, index]
}

router.get("/", (req, res) => {
    return res.redirect(`${process.env.PUBLIC_URL ?? ''}/${Math.random().toString().slice(2)}`)
})

/**
 * Get All Restaurant
 */
router.get('/api', async (req, res) => {
    return res.send(await getRestaurantList())
})

/**
 * Add New Restaurant
 */
router.post('/api', async (req, res) => {
    const payload = {
        restaurant: req.body.restaurant,
        weight: req.body.weight
    }
    if (payload.restaurant == null || payload.weight == null) return res.status(400).send()

    await createRestaurant(payload)
    return res.send()
})

/**
 * Update Restaurant
 */
router.patch('/api/:id', async (req, res) => {
    const {id} = req.params
    const payload = {
        restaurant: req.body.restaurant,
        weight: req.body.weight
    }
    if (payload.restaurant == null || payload.weight == null) return res.status(400).send()

    await updateRestaurant(id, payload)
    return res.send()
})

/**
 * Delete Restaurant
 */
router.delete('/api/:id', async (req, res) => {
    const {id} = req.params
    await deleteRestaurant(id)
    return res.send()
})

router.get("/image/:image(*)", (req, res) => {
    const img = Buffer.from(req.params.image, 'base64url');
    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
    });

    res.end(img);
})

async function seedHandlers(req, res, isWeighted) {
    const {seed} = req.params
    const [restaurantList, index] = await getRandomRestaurant(seed, isWeighted)
    return res.render('index.ejs', {
        publicUrl: process.env.PUBLIC_URL || '',
        image: new UltimateTextToImage(restaurantList[index].restaurant, {
            width: 128,
            height: 128,
            fontFamily: "Arial, Sans",
            fontColor: "#000000",
            fontSize: 16,
            minFontSize: 16,
            lineHeight: 16,
            autoWrapLineHeightMultiplier: 1.2,
            margin: 20,
            align: "center",
            valign: "middle",
            backgroundColor: "#FFFFFF",
        }).render().toDataUrl(),
        title: `Random Restaurant! - ${restaurantList[index].restaurant}`,
        restaurant: restaurantList[index].restaurant,
        restaurantList: restaurantList
    });
}

router.get("/:seed", (req, res) => seedHandlers(req, res, true))
router.get("/:seed/--no-weight", (req, res) => seedHandlers(req, res, false))



export default router
