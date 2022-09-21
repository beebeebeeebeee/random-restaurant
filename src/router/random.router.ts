import * as express from 'express'
import * as seedrandom from "seedrandom";
import {createRestaurant, database, deleteRestaurant, getRestaurantList, updateRestaurant} from "../database";
import {RestaurantModal} from "../modal/restaurant.modal";
import {generateImage} from "../util/generate.image";
import axios from "axios";
import {sendTeamsMessage} from "../util/team.message";
import {getRandomRestaurant} from "../service";

const publicUrl = process.env.PUBLIC_URL || ''
const router = express.Router()

router.get("/", (req, res) => {
    return res.redirect(`${process.env.PUBLIC_URL ?? ''}/boardId/1/seed/${Math.random().toString().slice(2)}`)
})

/**
 * Get All Restaurant
 */
router.get('/api/boardId/:boardId', async (req, res) => {
    const {boardId} = req.params
    return res.send(await getRestaurantList(boardId))
})

/**
 * Add New Restaurant
 */
router.post('/api/boardId/:boardId', async (req, res) => {
    const {boardId} = req.params
    const payload = {
        boardId: req.body.boardId,
        restaurant: req.body.restaurant,
        weight: req.body.weight,
        peopleLimit: req.body.peopleLimit
    }
    if (payload.boardId == null || payload.restaurant == null || payload.weight == null) return res.status(400).send()

    await createRestaurant(payload)
    return res.send()
})

/**
 * Update Restaurant
 */
router.patch('/api/id/:id', async (req, res) => {
    const {id} = req.params
    const payload = {
        boardId: req.body.boardId,
        restaurant: req.body.restaurant,
        weight: req.body.weight,
        peopleLimit: req.body.peopleLimit
    }
    if (payload.boardId == null || payload.restaurant == null || payload.weight == null || payload.peopleLimit == null) return res.status(400).send()

    await updateRestaurant(id, payload)
    return res.send()
})

/**
 * Delete Restaurant
 */
router.delete('/api/id/:id', async (req, res) => {
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

router.get("/boardId/:boardId/seed/:seed", async (req, res) => {
    const {boardId, seed} = req.params
    const {} = req.query
    const [restaurantList, index] = await getRandomRestaurant(boardId, seed, true)

    const restaurant = restaurantList[index]?.restaurant || ''

    return res.render('index.ejs', {
        publicUrl,
        image: generateImage(restaurant),
        title: `Random Restaurant! - ${restaurant}`,
        boardId,
        restaurant,
        restaurantList
    });
})


export default router
