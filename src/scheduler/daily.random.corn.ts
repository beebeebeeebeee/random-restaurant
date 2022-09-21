import * as cron from 'node-cron'
import {generateImage, isHoliday, sendTeamsMessage} from "../util";
import {getRandomRestaurant} from "../service";
import {isWeekday} from "../util/is.weekday";

const domain = process.env.DOMAIN || ''
const CRON_EXP = process.env.CRON_EXP
const boardId = '1'

if (CRON_EXP != null) {
    cron.schedule(CRON_EXP, async () => {
        if (!isWeekday() || await isHoliday()) return

        console.log(new Date(), "schedule job start")
        const seed = Math.random().toString().slice(2)
        const [restaurantList, index] = await getRandomRestaurant(boardId, seed, true)
        const restaurant = restaurantList[index]?.restaurant || ''
        const publicUrl = process.env.PUBLIC_URL || ''

        await sendTeamsMessage(
            restaurant,
            `${domain}${publicUrl}/image/boardId/${boardId}/seed/${seed}`,
            `${domain}${publicUrl}/boardId/${boardId}/seed/${seed}`
        )
    });
}