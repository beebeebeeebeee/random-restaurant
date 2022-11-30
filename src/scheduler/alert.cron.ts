import * as cron from 'node-cron'
import {isHoliday, sendTeamsMessage, isWeekday, getCurrentWeather, sendSlackMessage} from "../util";
import {getRandomRestaurant} from "../service";
import {getAlert} from "../database";
import {AlertType, CurrentWeatherType} from "../type";
import {WeatherWarnRainIconConstant, WeatherWarnTpIconConstant} from "../constant";

const domain = process.env.DOMAIN || ''
const publicUrl = process.env.PUBLIC_URL || ''

const getTime = (d: Date) => `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`

export async function processNotify(el: AlertType) {
    console.log(new Date(), "processNotify schedule job start", getTime(new Date()))

    await sendTeamsMessage(
        `Random process will start at ${el.scheduleTime.substring(0, 5)}`,
        null,
        `${domain}${publicUrl}/config/alertId/${el.id}`,
        `username: ${process.env.BASIC_AUTH_USER}<br />` +
        `password: ${process.env.BASIC_AUTH_PASSWORD}`
    )
}

export async function processSchedule(alertPayload: AlertType) {
    console.log(new Date(), "processSchedule schedule job start", getTime(new Date()))

    let currentWeather: CurrentWeatherType
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
    if (currentWeather != null) {
        subTitle.push(`Current ${alertPayload.district} average rainfall: ${currentWeather.avgRainfall}mm. ${currentWeather.icon}`)
        if (currentWeather.warnRain != null) {
            subTitle.push(WeatherWarnRainIconConstant[currentWeather.warnRain])
        }
        if (currentWeather.warnTp != null) {
            subTitle.push(WeatherWarnTpIconConstant[currentWeather.warnTp])
        }
    }

    await sendTeamsMessage(
        title,
        subTitle,
        `${domain}${publicUrl}/image/boardId/${alertPayload.boardId}/seed/${seed}/timestamp/${+new Date()}${query == '' ? '' : `/${query}`}`,
        `${domain}${publicUrl}/boardId/${alertPayload.boardId}/seed/${seed}/timestamp/${+new Date()}${query == '' ? '' : `?${query}`}`,
        currentWeather?.warning
    )
    await sendSlackMessage(
        title,
        subTitle,
        `${domain}${publicUrl}/image/boardId/${alertPayload.boardId}/seed/${seed}/timestamp/${+new Date()}${query == '' ? '' : `/${query}`}`,
        `${domain}${publicUrl}/boardId/${alertPayload.boardId}/seed/${seed}/timestamp/${+new Date()}${query == '' ? '' : `?${query}`}`,
        currentWeather?.warning
    )
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
                    console.log(isWeekday(), await isHoliday())
                    if (eachAlertPayload.scheduleEnableWeekdayOnly && !isWeekday()) continue;
                    if (eachAlertPayload.scheduleEnableNotHoliday && await isHoliday()) continue;
                }

                let promises = []
                if (isNotifyTime) promises.push(processNotify(eachAlertPayload));
                if (isScheduleTime) promises.push(processSchedule(eachAlertPayload));
                await Promise.all(promises)
            }
        } catch (error) {
            console.error(error)
        }
    });
}