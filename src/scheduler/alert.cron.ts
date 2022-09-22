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
        `Random process will start at ${el.scheduleTime}.`,
        null,
        `${domain}${publicUrl}/config/alertId/${el.id}`
    )
}

async function processSchedule(el: AlertType) {
    console.log(new Date(), "processSchedule schedule job start", getTime(new Date()))

    const seed = Math.random().toString().slice(2)
    const [restaurantList, indexes] = await getRandomRestaurant(el.boardId.toString(), seed, true, el.numberOfRandom)
    const restaurantResultList = indexes.map(index => restaurantList[index].restaurant).join(', ')

    const query = `${el.numberOfRandom == null || el.numberOfRandom == 1 ? '' : `times=${el.numberOfRandom}`}`

    await sendTeamsMessage(
        restaurantResultList,
        `${domain}${publicUrl}/image/boardId/${el.boardId}/seed/${seed}${query == '' ? '' : `/${query}`}`,
        `${domain}${publicUrl}/boardId/${el.boardId}/seed/${seed}${query == '' ? '' : `?${query}`}`
    )
}

export function startAlertCron() {
    cron.schedule('*/1 * * * *', async () => {
        const currentTime = getTime(new Date())
        const alertList = await getAlert()
        for (const el of alertList) {
            if(el.scheduleEnableWeekdayOnly && !isWeekday()) continue;
            if(el.scheduleEnableNotHoliday &&  await isHoliday()) continue;

            if(currentTime === el.notifyTime.substring(0,5)) void processNotify(el);
            if(currentTime === el.scheduleTime.substring(0,5)) void processSchedule(el);
        }
    });
}

