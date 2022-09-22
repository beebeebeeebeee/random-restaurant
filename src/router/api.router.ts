import * as express from "express";
import {createRestaurant, deleteRestaurant, getRestaurantList, updateRestaurant} from "../database";

const ApiRouter = express.Router()

/**
 * Get All Restaurant
 */
ApiRouter.get('/boardId/:boardId', async (req, res) => {
    const {boardId} = req.params
    return res.send(await getRestaurantList(boardId))
})

/**
 * Add New Restaurant
 */
ApiRouter.post('/boardId/:boardId', async (req, res) => {
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
ApiRouter.patch('/id/:id', async (req, res) => {
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
ApiRouter.delete('/id/:id', async (req, res) => {
    const {id} = req.params
    await deleteRestaurant(id)
    return res.send()
})

export {ApiRouter}