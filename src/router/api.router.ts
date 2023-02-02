import * as express from "express";
import {
    createRestaurant,
    deleteRestaurant,
    getAlert,
    getRestaurantList,
    triggerAlert,
    updateAlert,
    updateRestaurant
} from "../database";
import {AlertType} from "../type";
import {ApiEndpointConstant} from "../constant";

const ApiRouter = express.Router()

/**
 * Get Alert
 */
ApiRouter.get(ApiEndpointConstant.ALERT_GET, async (req, res) => {
    const {alertId} = req.params
    return res.send((await getAlert(alertId))[0])
})

/**
 * Update Alert
 */
ApiRouter.patch(ApiEndpointConstant.ALERT_UPDATE, async (req, res) => {
    const {alertId} = req.params
    const payload: AlertType = {
        id: alertId as any,
        boardId: req.body.boardId,
        dailyPeopleSize: req.body.dailyPeopleSize,
        numberOfRandom: req.body.numberOfRandom,
        notifyTime: req.body.notifyTime,
        scheduleTime: req.body.scheduleTime,
        lat: req.body.lat,
        long: req.body.long,
        region: req.body.region,
        district: req.body.district,
        scheduleEnableWeekdayOnly: req.body.scheduleEnableWeekdayOnly,
        scheduleEnableNotHoliday: req.body.scheduleEnableNotHoliday

    }
    if (payload.boardId == null || payload.dailyPeopleSize == null || payload.numberOfRandom == null || payload.scheduleEnableWeekdayOnly == null || payload.scheduleEnableNotHoliday == null) return res.status(400).send()

    await updateAlert(alertId, payload)
    return res.send()
})

/**
 * Trigger Now
 */
ApiRouter.post(ApiEndpointConstant.ALERT_TRIGGER, async (req, res) => {
    const {alertId} = req.params
    await triggerAlert(alertId)
})

/**
 * Add New Restaurant
 */
ApiRouter.post(ApiEndpointConstant.BOARD_CREATE, async (req, res) => {
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
ApiRouter.get(ApiEndpointConstant.BOARD_GET, async (req, res) => {
    const {boardId} = req.params
    return res.send(await getRestaurantList(boardId, new Date()))
})

/**
 * Update Restaurant
 */
ApiRouter.patch(ApiEndpointConstant.RESTAURANT_UPDATE, async (req, res) => {
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
ApiRouter.delete(ApiEndpointConstant.RESTAURANT_DELETE, async (req, res) => {
    const {id} = req.params
    await deleteRestaurant(id)
    return res.send()
})

export {ApiRouter}