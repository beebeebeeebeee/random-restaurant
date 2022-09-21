import * as cron from 'node-cron'
import {generateImage, isHoliday, sendTeamsMessage, isWeekday} from "../util";
import {getRandomRestaurant} from "../service";

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
        const image = generateImage(restaurant)
        const publicUrl = process.env.PUBLIC_URL || ''

        await sendTeamsMessage(
            restaurant,
            `${domain}${publicUrl}/image/${Buffer.from(image.split(",")[1], 'base64').toString('base64url')}`,
            `${domain}${publicUrl}/boardId/${boardId}/seed/${seed}`
        )
    });
}