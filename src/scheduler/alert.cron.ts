import * as cron from 'node-cron'
import {isHoliday, sendTeamsMessage, isWeekday, getCurrentWeather, sendSlackMessage, stringUtil} from "../util";
import {getRandomRestaurant} from "../service";
import {getAlert} from "../database";
import {AlertType, CurrentWeatherType} from "../type";
import {ViewEndpointConstant, WeatherWarnRainIconConstant, WeatherWarnTpIconConstant} from "../constant";
import {Config} from "../config";
import {getLogger} from "log4js";

const {domain, publicUrl} = Config
const logger = getLogger()

const getTime = (d: Date) => `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`

export async function processNotify(el: AlertType) {
    logger.info("processNotify schedule job start")

    try {
        await sendTeamsMessage(
            `Random process will start at ${el.scheduleTime?.substring(0, 5)}`,
            [],
            null,
            stringUtil.replaceUrlParams(ViewEndpointConstant.ALERT_VIEW, {
                alertId: el.id
            }, `${domain}${publicUrl}`),
            [`username: ${Config.basicAuthUser}<br />password: ${Config.basicAuthPassword}`]
        )
    } catch (error) {
        logger.error('processNotify send teams message error:', error)
    }

    try {
        await sendSlackMessage(
            `Random process will start at ${el.scheduleTime?.substring(0, 5)}`,
            [],
            null,
            stringUtil.replaceUrlParams(ViewEndpointConstant.ALERT_VIEW, {
                alertId: el.id
            }, `${domain}${publicUrl}`),
            [`username: ${Config.basicAuthUser}`, `password: ${Config.basicAuthPassword}`]
        )
    } catch (error) {
        logger.error('processNotify send slack message error:', error)
    }
}

export async function processSchedule(alertPayload: AlertType) {
    logger.info("processSchedule schedule job start")

    let currentWeather: CurrentWeatherType | undefined = undefined
    if (alertPayload.region != null && alertPayload.district != null) {
        currentWeather = await getCurrentWeather(alertPayload.region, alertPayload.district)
    }

    const seed = Math.random().toString().slice(2)
    const [restaurantList, indexes] = await getRandomRestaurant(alertPayload.boardId.toString(), seed, true, alertPayload.numberOfRandom, alertPayload.dailyPeopleSize)
    const restaurantResultList = indexes.map(index => restaurantList[index].restaurant).join(', ')

    const query = Object
        .entries({
            times: alertPayload.numberOfRandom,
            people: alertPayload.dailyPeopleSize
        })
        .map(([k, v]) => v == null ? null : `${k}=${v}`)
        .filter(el => el != null)
        .join('&')

    let title = `Today's restaurant: ${restaurantResultList}`
    let subTitle = []
    if (currentWeather !== undefined) {
        subTitle.push(`Current ${alertPayload.district} average rainfall: ${currentWeather.avgRainfall}mm. ${currentWeather.icon}`)
        if (currentWeather.warnRain != null) {
            subTitle.push(WeatherWarnRainIconConstant[currentWeather.warnRain])
        }
        if (currentWeather.warnTp != null) {
            subTitle.push(WeatherWarnTpIconConstant[currentWeather.warnTp])
        }
    }

    try {
        await sendTeamsMessage(
            title,
            subTitle,
            `${domain}${publicUrl}/image/boardId/${alertPayload.boardId}/seed/${seed}/timestamp/${+new Date()}${query == '' ? '' : `/${query}`}`,
            `${domain}${publicUrl}/boardId/${alertPayload.boardId}/seed/${seed}/timestamp/${+new Date()}${query == '' ? '' : `?${query}`}`,
            currentWeather?.warning
        )
    } catch (error) {
        logger.error('processSchedule send teams message error:', error)
    }

    try {
        await sendSlackMessage(
            title,
            subTitle,
            `${domain}${publicUrl}/image/boardId/${alertPayload.boardId}/seed/${seed}/timestamp/${+new Date()}${query == '' ? '' : `/${query}`}`,
            `${domain}${publicUrl}/boardId/${alertPayload.boardId}/seed/${seed}/timestamp/${+new Date()}${query == '' ? '' : `?${query}`}`,
            currentWeather?.warning
        )
    } catch (error) {
        logger.error('processSchedule send slack message error:', error)
    }
}

export function startAlertCron() {
    cron.schedule('*/1 * * * *', async () => {
        try {
            const currentTime = getTime(new Date())
            const alertList = await getAlert()
            for (const eachAlertPayload of alertList) {
                const isNotifyTime = currentTime === eachAlertPayload.notifyTime?.substring(0, 5)
                const isScheduleTime = currentTime === eachAlertPayload.scheduleTime?.substring(0, 5)

                if (isNotifyTime || isScheduleTime) {
                    if (eachAlertPayload.scheduleEnableWeekdayOnly && !isWeekday()) continue;
                    if (eachAlertPayload.scheduleEnableNotHoliday && await isHoliday()) continue;
                }

                let promises = []
                if (isNotifyTime) promises.push(processNotify(eachAlertPayload));
                if (isScheduleTime) promises.push(processSchedule(eachAlertPayload));
                await Promise.all(promises)
            }
        } catch (error) {
            logger.error(error)
        }
    });
}