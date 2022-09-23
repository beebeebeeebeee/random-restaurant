import * as cron from 'node-cron'
import {isHoliday, sendTeamsMessage, isWeekday} from "../util";
import {getRandomRestaurant} from "../service";
import {getAlert} from "../database";
import {AlertType} from "../type";

const domain = process.env.DOMAIN || ''
const publicUrl = process.env.PUBLIC_URL || ''

const getTime = (d: Date) => `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`

async function processNotify(el: AlertType) {
    console.log(new Date(), "processNotify schedule job start", getTime(new Date()))

    await sendTeamsMessage(
        `Random process will start at ${el.scheduleTime.substring(0,5)}`,
        null,
        `${domain}${publicUrl}/config/alertId/${el.id}`,
        `username: ${process.env.BASIC_AUTH_USER}; ` +
        `password: ${process.env.BASIC_AUTH_PASSWORD}`
    )
}

async function processSchedule(el: AlertType) {
    console.log(new Date(), "processSchedule schedule job start", getTime(new Date()))

    const seed = Math.random().toString().slice(2)
    const [restaurantList, indexes] = await getRandomRestaurant(el.boardId.toString(), seed, true, el.numberOfRandom)
    const restaurantResultList = indexes.map(index => restaurantList[index].restaurant).join(', ')

    const query = `${el.numberOfRandom == null || el.numberOfRandom == 1 ? '' : `times=${el.numberOfRandom}`}`

    await sendTeamsMessage(
        `Today's restaurant: ${restaurantResultList}`,
        `${domain}${publicUrl}/image/boardId/${el.boardId}/seed/${seed}${query == '' ? '' : `/${query}`}`,
        `${domain}${publicUrl}/boardId/${el.boardId}/seed/${seed}${query == '' ? '' : `?${query}`}`
    )
}

export function startAlertCron() {
    cron.schedule('*/1 * * * *', async () => {
        const currentTime = getTime(new Date())
        const alertList = await getAlert()
        for (const el of alertList) {
            const isNotifyTime = currentTime === el.notifyTime.substring(0, 5)
            const isScheduleTime = currentTime === el.scheduleTime.substring(0, 5)

            if (isNotifyTime || isScheduleTime) {
                if (el.scheduleEnableWeekdayOnly && !isWeekday()) continue;
                if (el.scheduleEnableNotHoliday && await isHoliday()) continue;
            }

            if (isNotifyTime) void processNotify(el);
            if (isScheduleTime) void processSchedule(el);
        }
    });
}

