import * as cron from 'node-cron'
import {isHoliday, sendTeamsMessage, isWeekday, getCurrentWeather} from "../util";
import {getRandomRestaurant} from "../service";
import {getAlert} from "../database";
import {AlertType, CurrentWeatherType} from "../type";

const domain = process.env.DOMAIN || ''
const publicUrl = process.env.PUBLIC_URL || ''

const getTime = (d: Date) => `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`

async function processNotify(el: AlertType) {
    console.log(new Date(), "processNotify schedule job start", getTime(new Date()))

    await sendTeamsMessage(
        `Random process will start at ${el.scheduleTime.substring(0, 5)}`,
        null,
        `${domain}${publicUrl}/config/alertId/${el.id}`,
        `username: ${process.env.BASIC_AUTH_USER}<br />` +
        `password: ${process.env.BASIC_AUTH_PASSWORD}`
    )
}

async function processSchedule(alertPayload: AlertType) {
    console.log(new Date(), "processSchedule schedule job start", getTime(new Date()))

    let currentWeather: CurrentWeatherType
    if(alertPayload.region != null && alertPayload.district != null){
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

    let title = `<span style='font-size: 2rem; font-weight: 300'>Today's restaurant: <span style='text-decoration: underline;'>${restaurantResultList}</span></span>`
    if(currentWeather !=null){
        title += `<br /><span style='font-size: 1.5rem; font-weight: 100'>Current ${alertPayload.district} average rainfall: ${currentWeather.avgRainfall}mm. ${currentWeather.icon}</span>`
    }

    await sendTeamsMessage(
        title,
        `${domain}${publicUrl}/image/boardId/${alertPayload.boardId}/seed/${seed}/timestamp/${+new Date()}${query == '' ? '' : `/${query}`}`,
        `${domain}${publicUrl}/boardId/${alertPayload.boardId}/seed/${seed}/timestamp/${+new Date()}${query == '' ? '' : `?${query}`}`,
        currentWeather.warning.join('<br />')
    )
}

export function startAlertCron() {
    cron.schedule('*/1 * * * *', async () => {
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

            if (isNotifyTime) void processNotify(eachAlertPayload);
            if (isScheduleTime) void processSchedule(eachAlertPayload);
        }
    });
}