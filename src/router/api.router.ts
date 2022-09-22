import * as express from "express";
import {
    createRestaurant,
    deleteRestaurant,
    getAlert,
    getRestaurantList,
    updateAlert,
    updateRestaurant
} from "../database";
import {AlertType} from "../type";

const ApiRouter = express.Router()


/**
 * Get Alert
 */
ApiRouter.get('/alertId/:alertId', async (req, res) => {
    const {alertId} = req.params
    return res.send((await getAlert(alertId))[0])
})

/**
 * Update Alert
 */
ApiRouter.patch('/alertId/:alertId', async (req, res) => {
    const {alertId} = req.params
    const payload: AlertType = {
        id: alertId as any,
        boardId: req.body.boardId,
        dailyPeopleSize: req.body.dailyPeopleSize,
        numberOfRandom: req.body.numberOfRandom,
        notifyTime: req.body.notifyTime,
        scheduleTime: req.body.scheduleTime,
        scheduleEnableWeekdayOnly: req.body.scheduleEnableWeekdayOnly,
        scheduleEnableNotHoliday: req.body.scheduleEnableNotHoliday

    }
    if (payload.boardId == null || payload.dailyPeopleSize == null || payload.numberOfRandom == null || payload.scheduleEnableWeekdayOnly == null || payload.scheduleEnableNotHoliday == null) return res.status(400).send()

    await updateAlert(alertId, payload)
    return res.send()
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