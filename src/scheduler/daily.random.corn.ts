import * as cron from 'node-cron'
import {generateImage, isHoliday, sendTeamsMessage, isWeekday} from "../util";
import {getRandomRestaurant} from "../service";

const domain = process.env.DOMAIN || ''
const CRON_EXP = process.env.CRON_EXP
const boardId = '1'
let times

if (CRON_EXP != null) {
    cron.schedule(CRON_EXP, async () => {
        if (!isWeekday() || await isHoliday()) return

        console.log(new Date(), "schedule job start")
        const seed = Math.random().toString().slice(2)

        const [restaurantList, indexes] = await getRandomRestaurant(boardId, seed, true, times != null ? parseInt(times) : undefined)

        const restaurantResultList = indexes.map(index => restaurantList[index].restaurant).join(', ')
        const publicUrl = process.env.PUBLIC_URL || ''

        await sendTeamsMessage(
            restaurantResultList,
            `${domain}${publicUrl}/image/boardId/${boardId}/seed/${seed}`,
            `${domain}${publicUrl}/boardId/${boardId}/seed/${seed}`
        )
    });
}